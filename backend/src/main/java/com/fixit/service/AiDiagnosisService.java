package com.fixit.service;

import com.fixit.dto.AiDiagnosisRequest;
import com.fixit.dto.AiDiagnosisResult;
import com.fixit.dto.ProblemResponse;
import com.fixit.entity.Problem;
import com.fixit.entity.ProblemDiagnosis;
import com.fixit.entity.ProblemStatus;
import com.fixit.exception.ApiException;
import com.fixit.repository.ProblemDiagnosisRepository;
import com.fixit.repository.ProblemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class AiDiagnosisService {

    private static final Logger log = LoggerFactory.getLogger(AiDiagnosisService.class);

    private final ProblemRepository problemRepository;
    private final ProblemDiagnosisRepository diagnosisRepository;
    private final RestTemplate restTemplate;

    @Value("${fixit.ai-service.url:http://localhost:8000/api/v1}")
    private String aiServiceBaseUrl;

    public AiDiagnosisService(ProblemRepository problemRepository,
                              ProblemDiagnosisRepository diagnosisRepository,
                              RestTemplateBuilder restTemplateBuilder) {
        this.problemRepository = problemRepository;
        this.diagnosisRepository = diagnosisRepository;
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(4))
                .setReadTimeout(Duration.ofSeconds(6))
                .build();
    }

    public ProblemResponse diagnoseProblem(Long problemId, String username, boolean isAdmin) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Problem not found with id: " + problemId));

        if (!isAdmin && !problem.getCreatedBy().getEmail().equalsIgnoreCase(username)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You are not authorized to diagnose this problem");
        }

        String assetInfo = null;
        if (problem.getAsset() != null) {
            assetInfo = String.format("%s %s (%s)",
                    problem.getAsset().getBrand() != null ? problem.getAsset().getBrand() : "",
                    problem.getAsset().getModel() != null ? problem.getAsset().getModel() : "",
                    problem.getAsset().getName());
        }

        AiDiagnosisRequest req = new AiDiagnosisRequest(
                problem.getTitle(),
                problem.getDescription(),
                problem.getCategory().name(),
                problem.getSeverity().name(),
                assetInfo
        );

        AiDiagnosisResult aiResult = callAiMicroserviceWithFallback(req);

        // Update or create ProblemDiagnosis
        ProblemDiagnosis diagnosis = problem.getDiagnosis();
        if (diagnosis == null) {
            diagnosis = new ProblemDiagnosis();
            diagnosis.setProblem(problem);
        }

        diagnosis.setSummary(aiResult.getSummary());
        diagnosis.setPossibleCauses(new ArrayList<>(aiResult.getPossibleCauses()));
        diagnosis.setRecommendedActions(new ArrayList<>(aiResult.getRecommendedActions()));
        diagnosis.setSafetyWarnings(new ArrayList<>(aiResult.getSafetyWarnings()));
        diagnosis.setSeverity(aiResult.getSeverity() != null ? aiResult.getSeverity() : problem.getSeverity().name());
        diagnosis.setDiySuitable(aiResult.isDiySuitable());
        diagnosis.setProfessionalRecommended(aiResult.isProfessionalRecommended());

        diagnosisRepository.save(diagnosis);
        problem.setDiagnosis(diagnosis);

        if (problem.getStatus() == ProblemStatus.REPORTED || problem.getStatus() == ProblemStatus.UNDER_REVIEW) {
            problem.setStatus(ProblemStatus.DIAGNOSED);
        }

        Problem updated = problemRepository.save(problem);
        return ProblemResponse.fromEntity(updated);
    }

    private AiDiagnosisResult callAiMicroserviceWithFallback(AiDiagnosisRequest request) {
        String endpoint = aiServiceBaseUrl + "/diagnose";
        try {
            log.info("Contacting FixIt AI Service at {}", endpoint);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<AiDiagnosisRequest> entity = new HttpEntity<>(request, headers);

            ResponseEntity<AiDiagnosisResult> response = restTemplate.exchange(
                    endpoint,
                    HttpMethod.POST,
                    entity,
                    AiDiagnosisResult.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            log.warn("FixIt AI microservice unreachable or returned error ({}). Triggering intelligent fallback engine.", e.getMessage());
        }

        // Graceful resilient fallback so users are never blocked
        return buildHeuristicFallback(request);
    }

    private AiDiagnosisResult buildHeuristicFallback(AiDiagnosisRequest req) {
        String cat = req.getCategory() != null ? req.getCategory().toUpperCase() : "OTHER";
        String text = (req.getTitle() + " " + req.getDescription()).toLowerCase();

        List<String> causes = new ArrayList<>();
        List<String> actions = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        boolean diySuitable = true;
        boolean proRecommended = false;
        String severity = req.getSeverity() != null ? req.getSeverity() : "MEDIUM";

        if ("ELECTRICAL".equals(cat)) {
            diySuitable = false;
            proRecommended = true;
            severity = "HIGH";
            causes.add("Faulty breaker, loose neutral wiring, or circuit overload.");
            causes.add("Damaged insulation resulting in current arcing.");
            actions.add("Isolate the circuit breaker immediately.");
            actions.add("Disconnect all devices from the affected circuit.");
            actions.add("Contact a licensed electrician.");
            warnings.add("ELECTRICAL SHOCK HAZARD: High voltage. Do not touch exposed metal or water.");
        } else if ("PLUMBING".equals(cat)) {
            if (text.contains("gas") || text.contains("heater")) {
                diySuitable = false;
                proRecommended = true;
                warnings.add("GAS RISK: Evacuate immediately if rotten egg odor is detected.");
            } else {
                causes.add("Degraded O-ring washer or high dynamic line pressure.");
                causes.add("Debris accumulation inside cartridge or aerator.");
                actions.add("Close fixture isolation valve.");
                actions.add("Check compression fittings for weeping.");
                warnings.add("WATER DAMAGE: Shut off water supply before disassembly.");
            }
        } else if ("VEHICLE".equals(cat)) {
            if (text.contains("brake") || text.contains("steering") || text.contains("engine")) {
                diySuitable = false;
                proRecommended = true;
                severity = "CRITICAL";
                causes.add("Brake pad friction wear, rotor warping, or hydraulic pressure drop.");
                actions.add("Inspect brake fluid reservoir level.");
                actions.add("Do not drive vehicle on highway; consult certified workshop.");
                warnings.add("CRITICAL VEHICLE SAFETY: Steering and braking faults threaten life safety.");
            } else {
                causes.add("12V battery drain or accessory relay failure.");
                actions.add("Check battery voltage with multimeter.");
            }
        } else {
            causes.add("Component wear, loose connector, or debris accumulation.");
            causes.add("Operational calibration or software configuration fault.");
            actions.add("Perform a complete device restart and physical inspection.");
            actions.add("Review operating documentation for known error codes.");
        }

        String summary = String.format("Automated diagnostic assessment for '%s'. Primary hypothesis indicates %s",
                req.getTitle(), causes.isEmpty() ? "operational wear" : causes.get(0).toLowerCase());

        return new AiDiagnosisResult(summary, causes, actions, severity, diySuitable, proRecommended, warnings);
    }
}
