package com.fixit.controller;

import com.fixit.dto.ApiResponse;
import com.fixit.dto.CreateProblemRequest;
import com.fixit.dto.ProblemResponse;
import com.fixit.dto.UpdateProblemRequest;
import com.fixit.service.ProblemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    private final ProblemService problemService;
    private final com.fixit.service.AiDiagnosisService aiDiagnosisService;

    public ProblemController(ProblemService problemService, com.fixit.service.AiDiagnosisService aiDiagnosisService) {
        this.problemService = problemService;
        this.aiDiagnosisService = aiDiagnosisService;
    }

    @PostMapping("/{id}/diagnose")
    public ResponseEntity<ApiResponse<ProblemResponse>> diagnoseProblem(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        ProblemResponse response = aiDiagnosisService.diagnoseProblem(id, userDetails.getUsername(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Problem diagnosed successfully", response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProblemResponse>> createProblem(
            @Valid @RequestBody CreateProblemRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        ProblemResponse response = problemService.createProblem(request, userDetails.getUsername());
        return new ResponseEntity<>(ApiResponse.success("Problem reported successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<ProblemResponse>>> getMyProblems(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<ProblemResponse> problems = problemService.getUserProblems(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("User problems retrieved successfully", problems));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ProblemResponse>>> getAllProblems() {
        List<ProblemResponse> problems = problemService.getAllProblems();
        return ResponseEntity.ok(ApiResponse.success("All problems retrieved successfully", problems));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProblemResponse>> getProblemById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        ProblemResponse response = problemService.getProblemById(id, userDetails.getUsername(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Problem details retrieved successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProblemResponse>> updateProblem(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProblemRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        ProblemResponse response = problemService.updateProblem(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Problem updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProblem(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        problemService.deleteProblem(id, userDetails.getUsername(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Problem deleted successfully", null));
    }

    @GetMapping("/{id}/similar")
    public ResponseEntity<ApiResponse<List<ProblemResponse>>> getSimilarProblems(@PathVariable Long id) {
        List<ProblemResponse> similar = problemService.getSimilarProblems(id);
        return ResponseEntity.ok(ApiResponse.success("Similar problems retrieved", similar));
    }
}
