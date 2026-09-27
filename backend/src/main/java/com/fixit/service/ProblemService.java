package com.fixit.service;

import com.fixit.dto.CreateProblemRequest;
import com.fixit.dto.ProblemResponse;
import com.fixit.dto.UpdateProblemRequest;
import com.fixit.entity.Asset;
import com.fixit.entity.Problem;
import com.fixit.entity.User;
import com.fixit.exception.ApiException;
import com.fixit.repository.AssetRepository;
import com.fixit.repository.ProblemRepository;
import com.fixit.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final AssetRepository assetRepository;

    public ProblemService(ProblemRepository problemRepository,
                          UserRepository userRepository,
                          AssetRepository assetRepository) {
        this.problemRepository = problemRepository;
        this.userRepository = userRepository;
        this.assetRepository = assetRepository;
    }

    @Transactional
    public ProblemResponse createProblem(CreateProblemRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User profile not found"));

        Problem problem = new Problem(
                request.getTitle().trim(),
                request.getDescription().trim(),
                request.getCategory(),
                request.getSubcategory() != null ? request.getSubcategory().trim() : null,
                request.getSeverity(),
                user
        );

        // Optional Asset Association with ownership verification
        if (request.getAssetId() != null) {
            Asset asset = assetRepository.findById(request.getAssetId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Asset not found with ID: " + request.getAssetId()));

            if (!asset.getOwner().getEmail().equalsIgnoreCase(userEmail)) {
                throw new ApiException(HttpStatus.FORBIDDEN, "You cannot associate a problem with an asset you do not own");
            }
            problem.setAsset(asset);
        }

        Problem savedProblem = problemRepository.save(problem);
        return ProblemResponse.fromEntity(savedProblem);
    }

    @Transactional(readOnly = true)
    public ProblemResponse getProblemById(Long id, String userEmail, boolean isAdmin) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Problem not found with ID: " + id));

        // Authorization check: Problem owner or admin only
        if (!isAdmin && !problem.getCreatedBy().getEmail().equalsIgnoreCase(userEmail)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You do not have permission to view this problem");
        }

        return ProblemResponse.fromEntity(problem);
    }

    @Transactional(readOnly = true)
    public List<ProblemResponse> getUserProblems(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User profile not found"));

        List<Problem> problems = problemRepository.findByCreatedByIdOrderByCreatedAtDesc(user.getId());
        return problems.stream().map(ProblemResponse::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public List<ProblemResponse> getAllProblems() {
        List<Problem> problems = problemRepository.findAllByOrderByCreatedAtDesc();
        return problems.stream().map(ProblemResponse::fromEntity).toList();
    }

    @Transactional
    public ProblemResponse updateProblem(Long id, UpdateProblemRequest request, String userEmail) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Problem not found with ID: " + id));

        // Ownership check: Only problem owner can modify their problem
        if (!problem.getCreatedBy().getEmail().equalsIgnoreCase(userEmail)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the problem owner can modify their own problem");
        }

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            problem.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null && !request.getDescription().isBlank()) {
            problem.setDescription(request.getDescription().trim());
        }
        if (request.getCategory() != null) {
            problem.setCategory(request.getCategory());
        }
        if (request.getSubcategory() != null) {
            problem.setSubcategory(request.getSubcategory().trim());
        }
        if (request.getSeverity() != null) {
            problem.setSeverity(request.getSeverity());
        }
        if (request.getStatus() != null) {
            problem.setStatus(request.getStatus());
        }

        if (request.getAssetId() != null) {
            Asset asset = assetRepository.findById(request.getAssetId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Asset not found with ID: " + request.getAssetId()));

            if (!asset.getOwner().getEmail().equalsIgnoreCase(userEmail)) {
                throw new ApiException(HttpStatus.FORBIDDEN, "You cannot associate a problem with an asset you do not own");
            }
            problem.setAsset(asset);
        }

        Problem updated = problemRepository.save(problem);
        return ProblemResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteProblem(Long id, String userEmail, boolean isAdmin) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Problem not found with ID: " + id));

        // Ownership or Admin check
        if (!isAdmin && !problem.getCreatedBy().getEmail().equalsIgnoreCase(userEmail)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the problem owner or an admin can delete this problem");
        }

        problemRepository.delete(problem);
    }

    public List<ProblemResponse> getSimilarProblems(Long id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Problem not found with ID: " + id));

        List<Problem> allInCat = problemRepository.findAll().stream()
                .filter(p -> p.getCategory() == problem.getCategory() && !p.getId().equals(id))
                .collect(Collectors.toList());

        String[] keywords = problem.getTitle().toLowerCase().split("\\s+");

        return allInCat.stream()
                .sorted((a, b) -> {
                    long aMatches = java.util.Arrays.stream(keywords).filter(k -> k.length() > 3 && (a.getTitle().toLowerCase().contains(k) || a.getDescription().toLowerCase().contains(k))).count();
                    long bMatches = java.util.Arrays.stream(keywords).filter(k -> k.length() > 3 && (b.getTitle().toLowerCase().contains(k) || b.getDescription().toLowerCase().contains(k))).count();
                    return Long.compare(bMatches, aMatches);
                })
                .limit(4)
                .map(ProblemResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
