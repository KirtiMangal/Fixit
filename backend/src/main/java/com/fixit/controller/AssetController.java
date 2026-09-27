package com.fixit.controller;

import com.fixit.dto.ApiResponse;
import com.fixit.dto.AssetResponse;
import com.fixit.dto.CreateAssetRequest;
import com.fixit.dto.UpdateAssetRequest;
import com.fixit.service.AssetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AssetResponse>> createAsset(
            @Valid @RequestBody CreateAssetRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        AssetResponse response = assetService.createAsset(request, userDetails.getUsername());
        return new ResponseEntity<>(ApiResponse.success("Thing/Device registered successfully", response), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssetResponse>>> getMyAssets(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<AssetResponse> assets = assetService.getUserAssets(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("User assets retrieved successfully", assets));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssetResponse>> getAssetById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        AssetResponse response = assetService.getAssetById(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Asset details retrieved successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AssetResponse>> updateAsset(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAssetRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        AssetResponse response = assetService.updateAsset(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Asset updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAsset(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        assetService.deleteAsset(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Asset deleted successfully", null));
    }
}
