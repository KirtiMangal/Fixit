package com.fixit.service;

import com.fixit.dto.*;
import com.fixit.entity.*;
import com.fixit.exception.ApiException;
import com.fixit.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ExpertService {

    private final ExpertProfileRepository expertProfileRepository;
    private final LearningSessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final RepairRecordService repairRecordService;
    private final NotificationService notificationService;

    public ExpertService(ExpertProfileRepository expertProfileRepository,
                         LearningSessionRepository sessionRepository,
                         UserRepository userRepository,
                         ProblemRepository problemRepository,
                         RepairRecordService repairRecordService,
                         NotificationService notificationService) {
        this.expertProfileRepository = expertProfileRepository;
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
        this.repairRecordService = repairRecordService;
        this.notificationService = notificationService;
    }

    public List<ExpertProfileResponse> searchExperts(ProblemCategory category) {
        List<ExpertProfile> list = expertProfileRepository.findAll();
        if (category != null) {
            list = list.stream()
                    .filter(e -> e.getSpecialties() != null && e.getSpecialties().contains(category))
                    .collect(Collectors.toList());
        }
        return list.stream().map(ExpertProfileResponse::fromEntity).collect(Collectors.toList());
    }

    public ExpertProfileResponse getExpertById(Long id) {
        ExpertProfile profile = expertProfileRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Expert profile not found with id: " + id));
        return ExpertProfileResponse.fromEntity(profile);
    }

    public ExpertProfileResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getRole() != Role.EXPERT) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only expert users have expert profiles");
        }

        ExpertProfile profile = expertProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> expertProfileRepository.save(new ExpertProfile(user)));

        return ExpertProfileResponse.fromEntity(profile);
    }

    public ExpertProfileResponse updateMyProfile(String email, UpdateExpertProfileRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getRole() != Role.EXPERT) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only expert users can update profile");
        }

        ExpertProfile profile = expertProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> new ExpertProfile(user));

        if (req.getBio() != null) profile.setBio(req.getBio());
        if (req.getSpecialties() != null) profile.setSpecialties(req.getSpecialties());
        if (req.getSessionRate() != null) profile.setSessionRate(req.getSessionRate());
        if (req.getAvailableHours() != null) profile.setAvailableHours(req.getAvailableHours());
        if (req.getDefaultMeetingLink() != null) profile.setDefaultMeetingLink(req.getDefaultMeetingLink());

        ExpertProfile saved = expertProfileRepository.save(profile);
        return ExpertProfileResponse.fromEntity(saved);
    }

    public LearningSessionResponse bookSession(CreateLearningSessionDto dto, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Customer not found"));

        User expert = userRepository.findById(dto.getExpertId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Expert not found with id: " + dto.getExpertId()));

        if (expert.getRole() != Role.EXPERT) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Selected provider is not an expert instructor");
        }

        Problem problem = null;
        if (dto.getProblemId() != null) {
            problem = problemRepository.findById(dto.getProblemId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Problem not found"));
            problem.setStatus(ProblemStatus.RESOLUTION_SELECTED);
            problemRepository.save(problem);
        }

        ExpertProfile expertProfile = expertProfileRepository.findByUserId(expert.getId()).orElse(null);
        double price = expertProfile != null ? expertProfile.getSessionRate() : 35.0;

        LearningSession s = new LearningSession();
        s.setCustomer(customer);
        s.setExpert(expert);
        s.setProblem(problem);
        s.setTitle(dto.getTitle());
        s.setTopic(dto.getTopic());
        s.setCategory(dto.getCategory());
        s.setScheduledAt(dto.getScheduledAt());
        s.setDurationMinutes(dto.getDurationMinutes() != null ? dto.getDurationMinutes() : 45);
        s.setSessionPrice(price);
        s.setCustomerNotes(dto.getCustomerNotes());
        s.setStatus(SessionStatus.SCHEDULED);

        if (expertProfile != null && expertProfile.getDefaultMeetingLink() != null) {
            s.setMeetingLink(expertProfile.getDefaultMeetingLink());
        }

        LearningSession saved = sessionRepository.save(s);

        notificationService.sendNotification(
                expert,
                "🎓 New Guided Session Booked",
                customer.getName() + " scheduled a learning session: " + dto.getTitle(),
                "/expert-sessions",
                NotificationType.SERVICE_UPDATE
        );

        return LearningSessionResponse.fromEntity(saved);
    }

    public List<LearningSessionResponse> getCustomerSessions(String email) {
        return sessionRepository.findByCustomerEmailOrderByScheduledAtDesc(email).stream()
                .map(LearningSessionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<LearningSessionResponse> getExpertSessions(String email) {
        return sessionRepository.findByExpertEmailOrderByScheduledAtDesc(email).stream()
                .map(LearningSessionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public LearningSessionResponse completeSession(Long sessionId, CompleteLearningSessionDto dto, String expertEmail) {
        LearningSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Session not found with id: " + sessionId));

        if (!session.getExpert().getEmail().equalsIgnoreCase(expertEmail)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the assigned expert can complete this session");
        }

        session.setStatus(SessionStatus.COMPLETED);
        session.setExpertSummary(dto.getExpertSummary());
        session.setChecklistItems(dto.getChecklistItems());

        if (session.getProblem() != null) {
            session.getProblem().setStatus(ProblemStatus.RESOLVED);
            problemRepository.save(session.getProblem());
        }

        // Log repair record
        repairRecordService.logRepair(
                session.getCustomer(),
                session.getProblem() != null ? session.getProblem().getAsset() : null,
                session.getProblem(),
                null,
                ResolutionType.EXPERT_SESSION,
                "Guided Repair: " + session.getTitle(),
                "Guided session with " + session.getExpert().getName() + ". Summary: " + dto.getExpertSummary(),
                session.getSessionPrice(),
                90
        );

        // Update expert session count
        ExpertProfile profile = expertProfileRepository.findByUserId(session.getExpert().getId()).orElse(null);
        if (profile != null) {
            profile.setSessionCount(profile.getSessionCount() + 1);
            expertProfileRepository.save(profile);
        }

        notificationService.sendNotification(
                session.getCustomer(),
                "🎓 Learning Session Completed",
                "Your expert instructor " + session.getExpert().getName() + " published session notes and marked the repair completed.",
                "/repairs",
                NotificationType.SERVICE_UPDATE
        );

        return LearningSessionResponse.fromEntity(sessionRepository.save(session));
    }
}
