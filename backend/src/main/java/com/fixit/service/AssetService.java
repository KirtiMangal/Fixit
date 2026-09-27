package com.fixit.service;

import com.fixit.dto.AssetResponse;
import com.fixit.dto.CreateAssetRequest;
import com.fixit.dto.UpdateAssetRequest;
import com.fixit.entity.Asset;
import com.fixit.entity.User;
import com.fixit.exception.ApiException;
import com.fixit.repository.AssetRepository;
import com.fixit.repository.ProblemRepository;
import com.fixit.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AssetService {

    private final AssetRepository assetRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;

    public AssetService(AssetRepository assetRepository,
                        ProblemRepository problemRepository,
                        UserRepository userRepository) {
        this.assetRepository = assetRepository;
        this.problemRepository = problemRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public AssetResponse createAsset(CreateAssetRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User profile not found"));

        Asset asset = new Asset(
                user,
                request.getName().trim(),
                request.getCategory(),
                request.getBrand() != null ? request.getBrand().trim() : null,
                request.getModel() != null ? request.getModel().trim() : null,
                request.getPurchaseDate(),
                request.getWarrantyEndDate(),
                request.getNotes() != null ? request.getNotes().trim() : null
        );

        Asset savedAsset = assetRepository.save(asset);
        return AssetResponse.fromEntity(savedAsset, 0L);
    }

    @Transactional(readOnly = true)
    public List<AssetResponse> getUserAssets(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User profile not found"));

        List<Asset> assets = assetRepository.findByOwnerIdOrderByCreatedAtDesc(user.getId());

        return assets.stream().map(asset -> {
            long problemCount = problemRepository.countByAssetId(asset.getId());
            return AssetResponse.fromEntity(asset, problemCount);
        }).toList();
    }

    @Transactional(readOnly = true)
    public AssetResponse getAssetById(Long id, String userEmail) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Asset not found with ID: " + id));

        // Ownership enforcement: Users must only access their own assets
        if (!asset.getOwner().getEmail().equalsIgnoreCase(userEmail)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You do not have permission to access this asset");
        }

        long problemCount = problemRepository.countByAssetId(asset.getId());
        return AssetResponse.fromEntity(asset, problemCount);
    }

    @Transactional
    public AssetResponse updateAsset(Long id, UpdateAssetRequest request, String userEmail) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Asset not found with ID: " + id));

        if (!asset.getOwner().getEmail().equalsIgnoreCase(userEmail)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the owner can modify this asset");
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            asset.setName(request.getName().trim());
        }
        if (request.getCategory() != null) {
            asset.setCategory(request.getCategory());
        }
        if (request.getBrand() != null) {
            asset.setBrand(request.getBrand().trim());
        }
        if (request.getModel() != null) {
            asset.setModel(request.getModel().trim());
        }
        if (request.getPurchaseDate() != null) {
            asset.setPurchaseDate(request.getPurchaseDate());
        }
        if (request.getWarrantyEndDate() != null) {
            asset.setWarrantyEndDate(request.getWarrantyEndDate());
        }
        if (request.getNotes() != null) {
            asset.setNotes(request.getNotes().trim());
        }

        Asset updated = assetRepository.save(asset);
        long problemCount = problemRepository.countByAssetId(updated.getId());
        return AssetResponse.fromEntity(updated, problemCount);
    }

    @Transactional
    public void deleteAsset(Long id, String userEmail) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Asset not found with ID: " + id));

        if (!asset.getOwner().getEmail().equalsIgnoreCase(userEmail)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the owner can delete this asset");
        }

        assetRepository.delete(asset);
    }
}
