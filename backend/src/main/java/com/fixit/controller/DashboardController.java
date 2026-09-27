package com.fixit.controller;

import com.fixit.dto.ApiResponse;
import com.fixit.dto.DashboardSummaryResponse;
import com.fixit.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getSummary(
            @AuthenticationPrincipal UserDetails userDetails) {
        DashboardSummaryResponse response = dashboardService.getSummary(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Dashboard summary retrieved", response));
    }
}
