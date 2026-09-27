package com.fixit.controller;

import com.fixit.dto.ApiResponse;
import com.fixit.dto.DiyGuideResponse;
import com.fixit.entity.DifficultyLevel;
import com.fixit.entity.ProblemCategory;
import com.fixit.service.DiyGuideService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diy-guides")
public class DiyGuideController {

    private final DiyGuideService diyGuideService;

    public DiyGuideController(DiyGuideService diyGuideService) {
        this.diyGuideService = diyGuideService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DiyGuideResponse>>> getGuides(
            @RequestParam(required = false) ProblemCategory category,
            @RequestParam(required = false) DifficultyLevel difficulty,
            @RequestParam(required = false) String search,
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails != null ? userDetails.getUsername() : null;
        List<DiyGuideResponse> list = diyGuideService.getGuides(category, difficulty, search, email);
        return ResponseEntity.ok(ApiResponse.success("DIY Guides retrieved successfully", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DiyGuideResponse>> getGuideById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails != null ? userDetails.getUsername() : null;
        DiyGuideResponse response = diyGuideService.getGuideById(id, email);
        return ResponseEntity.ok(ApiResponse.success("DIY Guide details retrieved", response));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<DiyGuideResponse>> completeGuide(
            @PathVariable Long id,
            @RequestParam(required = false) Long assetId,
            @AuthenticationPrincipal UserDetails userDetails) {
        DiyGuideResponse response = diyGuideService.completeGuide(id, userDetails.getUsername(), assetId);
        return ResponseEntity.ok(ApiResponse.success("DIY repair marked completed! Repair record generated.", response));
    }
}
