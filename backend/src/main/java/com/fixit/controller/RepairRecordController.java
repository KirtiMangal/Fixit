package com.fixit.controller;

import com.fixit.dto.ApiResponse;
import com.fixit.dto.RepairRecordResponse;
import com.fixit.dto.RepairStatsResponse;
import com.fixit.service.RepairRecordService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/repair-records")
public class RepairRecordController {

    private final RepairRecordService repairRecordService;

    public RepairRecordController(RepairRecordService repairRecordService) {
        this.repairRecordService = repairRecordService;
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<RepairRecordResponse>>> getMyRepairs(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<RepairRecordResponse> list = repairRecordService.getMyRepairs(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Repair history retrieved", list));
    }

    @GetMapping("/asset/{assetId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<RepairRecordResponse>>> getAssetRepairs(
            @PathVariable Long assetId,
            @AuthenticationPrincipal UserDetails userDetails) {
        List<RepairRecordResponse> list = repairRecordService.getAssetRepairs(assetId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Asset repair history retrieved", list));
    }

    @GetMapping("/stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<RepairStatsResponse>> getStats(
            @AuthenticationPrincipal UserDetails userDetails) {
        RepairStatsResponse stats = repairRecordService.getStats(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Repair statistics retrieved", stats));
    }
}
