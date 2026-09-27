package com.fixit.controller;

import com.fixit.dto.ApiResponse;
import com.fixit.dto.CreateReviewDto;
import com.fixit.dto.ReviewResponse;
import com.fixit.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<ReviewResponse>> submitReview(
            @Valid @RequestBody CreateReviewDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        ReviewResponse response = reviewService.createServiceReview(dto, userDetails.getUsername());
        return new ResponseEntity<>(ApiResponse.success("Review submitted successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getReviewsForUser(@PathVariable Long userId) {
        List<ReviewResponse> list = reviewService.getReviewsForUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved", list));
    }
}
