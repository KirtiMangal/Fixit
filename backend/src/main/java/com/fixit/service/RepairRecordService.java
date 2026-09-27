package com.fixit.service;

import com.fixit.dto.RepairRecordResponse;
import com.fixit.dto.RepairStatsResponse;
import com.fixit.entity.*;
import com.fixit.exception.ApiException;
import com.fixit.repository.AssetRepository;
import com.fixit.repository.RepairRecordRepository;
import com.fixit.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class RepairRecordService {

    private final RepairRecordRepository repairRecordRepository;
    private final UserRepository userRepository;
    private final AssetRepository assetRepository;

    public RepairRecordService(RepairRecordRepository repairRecordRepository,
                               UserRepository userRepository,
                               AssetRepository assetRepository) {
        this.repairRecordRepository = repairRecordRepository;
        this.userRepository = userRepository;
        this.assetRepository = assetRepository;
    }

    public RepairRecord logRepair(User user, Asset asset, Problem problem, ServiceRequest sr,
                                  ResolutionType type, String title, String summary, Double cost, Integer warrantyDays) {
        RepairRecord record = new RepairRecord(user, asset, problem, sr, type, title, summary, cost, warrantyDays, Instant.now());
        return repairRecordRepository.save(record);
    }

    public List<RepairRecordResponse> getMyRepairs(String email) {
        return repairRecordRepository.findByUserEmailOrderByRepairedAtDesc(email).stream()
                .map(RepairRecordResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<RepairRecordResponse> getAssetRepairs(Long assetId, String email) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Asset not found"));

        if (!asset.getOwner().getEmail().equalsIgnoreCase(email)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Not authorized to access asset repairs");
        }

        return repairRecordRepository.findByAssetIdOrderByRepairedAtDesc(assetId).stream()
                .map(RepairRecordResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public RepairStatsResponse getStats(String email) {
        List<RepairRecord> records = repairRecordRepository.findByUserEmailOrderByRepairedAtDesc(email);
        long totalRepairs = records.size();
        double totalSpent = records.stream().mapToDouble(RepairRecord::getCost).sum();

        Map<String, Long> byType = new HashMap<>();
        byType.put("DIY_GUIDE", records.stream().filter(r -> r.getResolutionType() == ResolutionType.DIY_GUIDE).count());
        byType.put("EXPERT_SESSION", records.stream().filter(r -> r.getResolutionType() == ResolutionType.EXPERT_SESSION).count());
        byType.put("TECHNICIAN_SERVICE", records.stream().filter(r -> r.getResolutionType() == ResolutionType.TECHNICIAN_SERVICE).count());

        // Baseline technician dispatch cost ~$120. Savings = (DIY count * $120) + (Expert count * $50) - actual spend
        long diyCount = byType.getOrDefault("DIY_GUIDE", 0L);
        double estimatedSavings = Math.max(0.0, (diyCount * 120.0) - totalSpent);

        return new RepairStatsResponse(totalRepairs, totalSpent, estimatedSavings, byType);
    }
}
