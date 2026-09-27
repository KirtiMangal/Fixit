package com.fixit.controller;

import com.fixit.dto.ApiResponse;
import com.fixit.dto.TechnicianProfileResponse;
import com.fixit.dto.UpdateTechnicianProfileRequest;
import com.fixit.entity.ProblemCategory;
import com.fixit.entity.VerificationStatus;
import com.fixit.service.TechnicianService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TechnicianController {

    private final TechnicianService technicianService;

    public TechnicianController(TechnicianService technicianService) {
        this.technicianService = technicianService;
    }

    @GetMapping("/technicians")
    public ResponseEntity<ApiResponse<List<TechnicianProfileResponse>>> searchTechnicians(
            @RequestParam(required = false) ProblemCategory category,
            @RequestParam(required = false) String serviceArea,
            @RequestParam(defaultValue = "false") boolean availableOnly) {
        List<TechnicianProfileResponse> list = technicianService.searchTechnicians(category, serviceArea, availableOnly);
        return ResponseEntity.ok(ApiResponse.success("Technicians retrieved successfully", list));
    }

    @GetMapping("/technicians/{id}")
    public ResponseEntity<ApiResponse<TechnicianProfileResponse>> getTechnicianById(@PathVariable Long id) {
        TechnicianProfileResponse response = technicianService.getTechnicianById(id);
        return ResponseEntity.ok(ApiResponse.success("Technician details retrieved successfully", response));
    }

    @GetMapping("/technicians/me")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<ApiResponse<TechnicianProfileResponse>> getMyProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        TechnicianProfileResponse response = technicianService.getMyProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Technician profile retrieved successfully", response));
    }

    @PutMapping("/technicians/me")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<ApiResponse<TechnicianProfileResponse>> updateMyProfile(
            @RequestBody UpdateTechnicianProfileRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        TechnicianProfileResponse response = technicianService.updateMyProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Technician profile updated successfully", response));
    }

    @GetMapping("/admin/technicians")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<TechnicianProfileResponse>>> getAllTechniciansForAdmin() {
        List<TechnicianProfileResponse> list = technicianService.getAllProfilesForAdmin();
        return ResponseEntity.ok(ApiResponse.success("All technician profiles retrieved successfully", list));
    }

    @PutMapping("/admin/technicians/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TechnicianProfileResponse>> verifyTechnician(@PathVariable Long id) {
        TechnicianProfileResponse response = technicianService.setVerificationStatus(id, VerificationStatus.VERIFIED);
        return ResponseEntity.ok(ApiResponse.success("Technician verified successfully", response));
    }

    @PutMapping("/admin/technicians/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TechnicianProfileResponse>> rejectTechnician(@PathVariable Long id) {
        TechnicianProfileResponse response = technicianService.setVerificationStatus(id, VerificationStatus.REJECTED);
        return ResponseEntity.ok(ApiResponse.success("Technician rejected successfully", response));
    }
}
