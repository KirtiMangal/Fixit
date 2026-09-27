package com.fixit.controller;

import com.fixit.dto.ApiResponse;
import com.fixit.dto.CompleteServiceRequestDto;
import com.fixit.dto.CreateServiceRequestDto;
import com.fixit.dto.ServiceRequestResponse;
import com.fixit.service.ServiceRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-requests")
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;

    public ServiceRequestController(ServiceRequestService serviceRequestService) {
        this.serviceRequestService = serviceRequestService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<ServiceRequestResponse>> createRequest(
            @Valid @RequestBody CreateServiceRequestDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        ServiceRequestResponse response = serviceRequestService.createRequest(dto, userDetails.getUsername());
        return new ResponseEntity<>(ApiResponse.success("Service request submitted successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<List<ServiceRequestResponse>>> getMyCustomerRequests(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<ServiceRequestResponse> list = serviceRequestService.getCustomerRequests(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Customer service requests retrieved", list));
    }

    @GetMapping("/technician")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<ApiResponse<List<ServiceRequestResponse>>> getMyTechnicianRequests(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<ServiceRequestResponse> list = serviceRequestService.getTechnicianRequests(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Technician service requests retrieved", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceRequestResponse>> getRequestById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        boolean isAdmin = userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        ServiceRequestResponse response = serviceRequestService.getRequestById(id, userDetails.getUsername(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Service request retrieved", response));
    }

    @PutMapping("/{id}/accept")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<ApiResponse<ServiceRequestResponse>> acceptRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        ServiceRequestResponse response = serviceRequestService.acceptRequest(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Service request accepted", response));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<ApiResponse<ServiceRequestResponse>> rejectRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        ServiceRequestResponse response = serviceRequestService.rejectRequest(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Service request rejected", response));
    }

    @PutMapping("/{id}/start")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<ApiResponse<ServiceRequestResponse>> startRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        ServiceRequestResponse response = serviceRequestService.startRequest(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Service request marked in-progress", response));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<ApiResponse<ServiceRequestResponse>> completeRequest(
            @PathVariable Long id,
            @Valid @RequestBody CompleteServiceRequestDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        ServiceRequestResponse response = serviceRequestService.completeRequest(id, dto, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Service request marked completed", response));
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<ServiceRequestResponse>> cancelRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        ServiceRequestResponse response = serviceRequestService.cancelRequest(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Service request cancelled", response));
    }
}
