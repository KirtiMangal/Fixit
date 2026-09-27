package com.fixit.controller;

import com.fixit.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class RoleTestController {

    @GetMapping("/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<String>> customerAccess() {
        return ResponseEntity.ok(ApiResponse.success("Access granted: Customer resource"));
    }

    @GetMapping("/technician")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<ApiResponse<String>> technicianAccess() {
        return ResponseEntity.ok(ApiResponse.success("Access granted: Technician resource"));
    }

    @GetMapping("/expert")
    @PreAuthorize("hasRole('EXPERT')")
    public ResponseEntity<ApiResponse<String>> expertAccess() {
        return ResponseEntity.ok(ApiResponse.success("Access granted: Expert resource"));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> adminAccess() {
        return ResponseEntity.ok(ApiResponse.success("Access granted: Admin resource"));
    }
}
