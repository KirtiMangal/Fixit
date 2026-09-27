package com.fixit.service;

import com.fixit.dto.ExpertProfileResponse;
import com.fixit.dto.PlatformMetricsResponse;
import com.fixit.dto.UserResponse;
import com.fixit.entity.*;
import com.fixit.exception.ApiException;
import com.fixit.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminService {

    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final TechnicianProfileRepository technicianProfileRepository;
    private final ExpertProfileRepository expertProfileRepository;

    public AdminService(UserRepository userRepository,
                        ProblemRepository problemRepository,
                        ServiceRequestRepository serviceRequestRepository,
                        TechnicianProfileRepository technicianProfileRepository,
                        ExpertProfileRepository expertProfileRepository) {
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
        this.serviceRequestRepository = serviceRequestRepository;
        this.technicianProfileRepository = technicianProfileRepository;
        this.expertProfileRepository = expertProfileRepository;
    }

    public PlatformMetricsResponse getPlatformMetrics() {
        PlatformMetricsResponse m = new PlatformMetricsResponse();

        List<User> allUsers = userRepository.findAll();
        m.setTotalUsers(allUsers.size());
        m.setTotalCustomers(allUsers.stream().filter(u -> u.getRole() == Role.CUSTOMER).count());
        m.setTotalTechnicians(allUsers.stream().filter(u -> u.getRole() == Role.TECHNICIAN).count());
        m.setTotalExperts(allUsers.stream().filter(u -> u.getRole() == Role.EXPERT).count());

        List<Problem> allProblems = problemRepository.findAll();
        m.setTotalProblems(allProblems.size());

        Map<String, Long> statusMap = new HashMap<>();
        for (ProblemStatus st : ProblemStatus.values()) {
            statusMap.put(st.name(), allProblems.stream().filter(p -> p.getStatus() == st).count());
        }
        m.setProblemsByStatus(statusMap);

        List<ServiceRequest> allRequests = serviceRequestRepository.findAll();
        m.setTotalServices(allRequests.size());
        long completed = allRequests.stream().filter(r -> r.getStatus() == ServiceRequestStatus.COMPLETED).count();
        m.setCompletedServices(completed);

        double gmv = allRequests.stream()
                .filter(r -> r.getStatus() == ServiceRequestStatus.COMPLETED && r.getFinalCost() != null)
                .mapToDouble(ServiceRequest::getFinalCost)
                .sum();
        m.setTotalGmv(gmv);

        long pendingTechs = technicianProfileRepository.findByVerificationStatus(VerificationStatus.PENDING).size();
        m.setPendingTechnicianVerifications(pendingTechs);

        long pendingExperts = expertProfileRepository.findByVerificationStatus(VerificationStatus.PENDING).size();
        m.setPendingExpertVerifications(pendingExperts);

        return m;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public UserResponse updateUserRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        user.setRole(newRole);
        return UserResponse.fromEntity(userRepository.save(user));
    }

    public List<ExpertProfileResponse> getAllExperts() {
        return expertProfileRepository.findAll().stream()
                .map(ExpertProfileResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public ExpertProfileResponse setExpertVerification(Long expertId, VerificationStatus status) {
        ExpertProfile profile = expertProfileRepository.findById(expertId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Expert profile not found"));
        profile.setVerificationStatus(status);
        return ExpertProfileResponse.fromEntity(expertProfileRepository.save(profile));
    }
}
