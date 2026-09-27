package com.fixit.service;

import com.fixit.dto.TechnicianProfileResponse;
import com.fixit.dto.UpdateTechnicianProfileRequest;
import com.fixit.entity.ProblemCategory;
import com.fixit.entity.Role;
import com.fixit.entity.TechnicianProfile;
import com.fixit.entity.User;
import com.fixit.entity.VerificationStatus;
import com.fixit.exception.ApiException;
import com.fixit.repository.TechnicianProfileRepository;
import com.fixit.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TechnicianService {

    private final TechnicianProfileRepository technicianProfileRepository;
    private final UserRepository userRepository;

    public TechnicianService(TechnicianProfileRepository technicianProfileRepository,
                             UserRepository userRepository) {
        this.technicianProfileRepository = technicianProfileRepository;
        this.userRepository = userRepository;
    }

    public List<TechnicianProfileResponse> searchTechnicians(ProblemCategory category, String serviceArea, boolean availableOnly) {
        List<TechnicianProfile> list = technicianProfileRepository.searchTechnicians(
                VerificationStatus.VERIFIED,
                availableOnly,
                (serviceArea != null && !serviceArea.isBlank()) ? serviceArea : null
        );

        if (category != null) {
            list = list.stream()
                    .filter(t -> t.getSpecialties() != null && t.getSpecialties().contains(category))
                    .collect(Collectors.toList());
        }

        return list.stream().map(TechnicianProfileResponse::fromEntity).collect(Collectors.toList());
    }

    public TechnicianProfileResponse getTechnicianById(Long id) {
        TechnicianProfile profile = technicianProfileRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Technician profile not found with id: " + id));
        return TechnicianProfileResponse.fromEntity(profile);
    }

    public TechnicianProfileResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getRole() != Role.TECHNICIAN) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only technicians possess a technician profile");
        }

        TechnicianProfile profile = technicianProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> technicianProfileRepository.save(new TechnicianProfile(user)));

        return TechnicianProfileResponse.fromEntity(profile);
    }

    public TechnicianProfileResponse updateMyProfile(String email, UpdateTechnicianProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getRole() != Role.TECHNICIAN) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only technicians can update technician profiles");
        }

        TechnicianProfile profile = technicianProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> new TechnicianProfile(user));

        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getSpecialties() != null) profile.setSpecialties(request.getSpecialties());
        if (request.getExperienceYears() != null) profile.setExperienceYears(request.getExperienceYears());
        if (request.getHourlyRate() != null) profile.setHourlyRate(request.getHourlyRate());
        if (request.getServiceArea() != null) profile.setServiceArea(request.getServiceArea());
        if (request.getIsAvailable() != null) profile.setAvailable(request.getIsAvailable());

        TechnicianProfile saved = technicianProfileRepository.save(profile);
        return TechnicianProfileResponse.fromEntity(saved);
    }

    public TechnicianProfileResponse setVerificationStatus(Long id, VerificationStatus status) {
        TechnicianProfile profile = technicianProfileRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Technician profile not found with id: " + id));

        profile.setVerificationStatus(status);
        TechnicianProfile saved = technicianProfileRepository.save(profile);
        return TechnicianProfileResponse.fromEntity(saved);
    }

    public List<TechnicianProfileResponse> getAllProfilesForAdmin() {
        return technicianProfileRepository.findAll().stream()
                .map(TechnicianProfileResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
