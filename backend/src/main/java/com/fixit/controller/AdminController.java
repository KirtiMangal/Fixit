package com.fixit.controller;

import com.fixit.dto.ApiResponse;
import com.fixit.dto.ExpertProfileResponse;
import com.fixit.dto.PlatformMetricsResponse;
import com.fixit.dto.UserResponse;
import com.fixit.entity.Role;
import com.fixit.entity.VerificationStatus;
import com.fixit.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<PlatformMetricsResponse>> getMetrics() {
        PlatformMetricsResponse metrics = adminService.getPlatformMetrics();
        return ResponseEntity.ok(ApiResponse.success("Platform metrics retrieved", metrics));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> list = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("All users retrieved", list));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserRole(
            @PathVariable Long id,
            @RequestParam Role role) {
        UserResponse response = adminService.updateUserRole(id, role);
        return ResponseEntity.ok(ApiResponse.success("User role updated successfully", response));
    }

    @GetMapping("/experts")
    public ResponseEntity<ApiResponse<List<ExpertProfileResponse>>> getAllExperts() {
        List<ExpertProfileResponse> list = adminService.getAllExperts();
        return ResponseEntity.ok(ApiResponse.success("All expert profiles retrieved", list));
    }

    @PutMapping("/experts/{id}/verify")
    public ResponseEntity<ApiResponse<ExpertProfileResponse>> verifyExpert(@PathVariable Long id) {
        ExpertProfileResponse response = adminService.setExpertVerification(id, VerificationStatus.VERIFIED);
        return ResponseEntity.ok(ApiResponse.success("Expert verified successfully", response));
    }

    @PutMapping("/experts/{id}/reject")
    public ResponseEntity<ApiResponse<ExpertProfileResponse>> rejectExpert(@PathVariable Long id) {
        ExpertProfileResponse response = adminService.setExpertVerification(id, VerificationStatus.REJECTED);
        return ResponseEntity.ok(ApiResponse.success("Expert rejected successfully", response));
    }
}
