package com.fixit.controller;

import com.fixit.dto.*;
import com.fixit.entity.ProblemCategory;
import com.fixit.service.ExpertService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ExpertController {

    private final ExpertService expertService;

    public ExpertController(ExpertService expertService) {
        this.expertService = expertService;
    }

    @GetMapping("/experts")
    public ResponseEntity<ApiResponse<List<ExpertProfileResponse>>> searchExperts(
            @RequestParam(required = false) ProblemCategory category) {
        List<ExpertProfileResponse> list = expertService.searchExperts(category);
        return ResponseEntity.ok(ApiResponse.success("Expert instructors retrieved", list));
    }

    @GetMapping("/experts/{id}")
    public ResponseEntity<ApiResponse<ExpertProfileResponse>> getExpertById(@PathVariable Long id) {
        ExpertProfileResponse response = expertService.getExpertById(id);
        return ResponseEntity.ok(ApiResponse.success("Expert details retrieved", response));
    }

    @GetMapping("/experts/me")
    @PreAuthorize("hasRole('EXPERT')")
    public ResponseEntity<ApiResponse<ExpertProfileResponse>> getMyProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        ExpertProfileResponse response = expertService.getMyProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Expert profile retrieved", response));
    }

    @PutMapping("/experts/me")
    @PreAuthorize("hasRole('EXPERT')")
    public ResponseEntity<ApiResponse<ExpertProfileResponse>> updateMyProfile(
            @RequestBody UpdateExpertProfileRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        ExpertProfileResponse response = expertService.updateMyProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Expert profile updated", response));
    }

    @PostMapping("/learning-sessions")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<LearningSessionResponse>> bookSession(
            @Valid @RequestBody CreateLearningSessionDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        LearningSessionResponse response = expertService.bookSession(dto, userDetails.getUsername());
        return new ResponseEntity<>(ApiResponse.success("Learning session booked successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/learning-sessions/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<List<LearningSessionResponse>>> getMySessions(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<LearningSessionResponse> list = expertService.getCustomerSessions(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Customer learning sessions retrieved", list));
    }

    @GetMapping("/learning-sessions/expert")
    @PreAuthorize("hasRole('EXPERT')")
    public ResponseEntity<ApiResponse<List<LearningSessionResponse>>> getExpertSessions(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<LearningSessionResponse> list = expertService.getExpertSessions(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Expert sessions retrieved", list));
    }

    @PutMapping("/learning-sessions/{id}/complete")
    @PreAuthorize("hasRole('EXPERT')")
    public ResponseEntity<ApiResponse<LearningSessionResponse>> completeSession(
            @PathVariable Long id,
            @Valid @RequestBody CompleteLearningSessionDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        LearningSessionResponse response = expertService.completeSession(id, dto, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Learning session completed and repair logged", response));
    }
}
