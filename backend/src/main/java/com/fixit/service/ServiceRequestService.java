package com.fixit.service;

import com.fixit.dto.CompleteServiceRequestDto;
import com.fixit.dto.CreateServiceRequestDto;
import com.fixit.dto.ServiceRequestResponse;
import com.fixit.entity.*;
import com.fixit.exception.ApiException;
import com.fixit.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ServiceRequestService {

    private final ServiceRequestRepository serviceRequestRepository;
    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final AssetRepository assetRepository;
    private final RepairRecordService repairRecordService;
    private final NotificationService notificationService;

    public ServiceRequestService(ServiceRequestRepository serviceRequestRepository,
                                 UserRepository userRepository,
                                 ProblemRepository problemRepository,
                                 AssetRepository assetRepository,
                                 RepairRecordService repairRecordService,
                                 NotificationService notificationService) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
        this.assetRepository = assetRepository;
        this.repairRecordService = repairRecordService;
        this.notificationService = notificationService;
    }

    public ServiceRequestResponse createRequest(CreateServiceRequestDto dto, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Customer not found"));

        User technician = userRepository.findById(dto.getTechnicianId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Technician not found with id: " + dto.getTechnicianId()));

        if (technician.getRole() != Role.TECHNICIAN) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Selected provider is not a technician");
        }

        Problem problem = null;
        if (dto.getProblemId() != null) {
            problem = problemRepository.findById(dto.getProblemId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Problem not found with id: " + dto.getProblemId()));
            if (!problem.getCreatedBy().getId().equals(customer.getId())) {
                throw new ApiException(HttpStatus.FORBIDDEN, "You cannot link a problem reported by someone else");
            }
            problem.setStatus(ProblemStatus.RESOLUTION_SELECTED);
            problemRepository.save(problem);
        }

        Asset asset = null;
        if (dto.getAssetId() != null) {
            asset = assetRepository.findById(dto.getAssetId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Asset not found with id: " + dto.getAssetId()));
            if (!asset.getOwner().getId().equals(customer.getId())) {
                throw new ApiException(HttpStatus.FORBIDDEN, "You cannot link an asset owned by someone else");
            }
        } else if (problem != null && problem.getAsset() != null) {
            asset = problem.getAsset();
        }

        ServiceRequest request = new ServiceRequest();
        request.setCustomer(customer);
        request.setTechnician(technician);
        request.setProblem(problem);
        request.setAsset(asset);
        request.setTitle(dto.getTitle());
        request.setDescription(dto.getDescription());
        request.setCategory(dto.getCategory());
        request.setScheduledDate(dto.getScheduledDate());
        request.setEstimatedCost(dto.getEstimatedCost());
        request.setCustomerNotes(dto.getCustomerNotes());
        request.setStatus(ServiceRequestStatus.REQUESTED);

        ServiceRequest saved = serviceRequestRepository.save(request);

        // Notify assigned technician
        notificationService.sendNotification(
                technician,
                "New Service Request",
                "Customer " + customer.getName() + " requested service: " + dto.getTitle(),
                "/service-requests",
                NotificationType.SERVICE_UPDATE
        );

        return ServiceRequestResponse.fromEntity(saved);
    }

    public List<ServiceRequestResponse> getCustomerRequests(String customerEmail) {
        return serviceRequestRepository.findByCustomerEmailOrderByCreatedAtDesc(customerEmail).stream()
                .map(ServiceRequestResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ServiceRequestResponse> getTechnicianRequests(String technicianEmail) {
        return serviceRequestRepository.findByTechnicianEmailOrderByCreatedAtDesc(technicianEmail).stream()
                .map(ServiceRequestResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public ServiceRequestResponse getRequestById(Long id, String email, boolean isAdmin) {
        ServiceRequest sr = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Service request not found with id: " + id));

        boolean isCustomer = sr.getCustomer().getEmail().equalsIgnoreCase(email);
        boolean isTechnician = sr.getTechnician().getEmail().equalsIgnoreCase(email);

        if (!isAdmin && !isCustomer && !isTechnician) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You are not authorized to view this service request");
        }

        return ServiceRequestResponse.fromEntity(sr);
    }

    public ServiceRequestResponse acceptRequest(Long id, String technicianEmail) {
        ServiceRequest sr = findAndVerifyTechnician(id, technicianEmail);
        if (sr.getStatus() != ServiceRequestStatus.REQUESTED) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Cannot accept request with status: " + sr.getStatus());
        }

        sr.setStatus(ServiceRequestStatus.ACCEPTED);
        ServiceRequest updated = serviceRequestRepository.save(sr);

        // Notify customer
        notificationService.sendNotification(
                sr.getCustomer(),
                "Service Request Accepted",
                "Technician " + sr.getTechnician().getName() + " accepted your request for " + sr.getTitle(),
                "/service-requests",
                NotificationType.SERVICE_UPDATE
        );

        return ServiceRequestResponse.fromEntity(updated);
    }

    public ServiceRequestResponse rejectRequest(Long id, String technicianEmail) {
        ServiceRequest sr = findAndVerifyTechnician(id, technicianEmail);
        if (sr.getStatus() != ServiceRequestStatus.REQUESTED) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Cannot reject request with status: " + sr.getStatus());
        }

        sr.setStatus(ServiceRequestStatus.REJECTED);
        ServiceRequest updated = serviceRequestRepository.save(sr);

        // Notify customer
        notificationService.sendNotification(
                sr.getCustomer(),
                "Service Request Declined",
                "Technician " + sr.getTechnician().getName() + " could not take request: " + sr.getTitle(),
                "/service-requests",
                NotificationType.SERVICE_UPDATE
        );

        return ServiceRequestResponse.fromEntity(updated);
    }

    public ServiceRequestResponse startRequest(Long id, String technicianEmail) {
        ServiceRequest sr = findAndVerifyTechnician(id, technicianEmail);
        if (sr.getStatus() != ServiceRequestStatus.ACCEPTED) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Cannot start a service request that is not ACCEPTED");
        }

        sr.setStatus(ServiceRequestStatus.IN_PROGRESS);
        if (sr.getProblem() != null) {
            sr.getProblem().setStatus(ProblemStatus.IN_PROGRESS);
            problemRepository.save(sr.getProblem());
        }

        ServiceRequest updated = serviceRequestRepository.save(sr);

        // Notify customer
        notificationService.sendNotification(
                sr.getCustomer(),
                "Service Started",
                "Technician " + sr.getTechnician().getName() + " has started work on " + sr.getTitle(),
                "/service-requests",
                NotificationType.SERVICE_UPDATE
        );

        return ServiceRequestResponse.fromEntity(updated);
    }

    public ServiceRequestResponse completeRequest(Long id, CompleteServiceRequestDto dto, String technicianEmail) {
        ServiceRequest sr = findAndVerifyTechnician(id, technicianEmail);
        if (sr.getStatus() != ServiceRequestStatus.IN_PROGRESS) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Only IN_PROGRESS requests can be completed");
        }

        sr.setStatus(ServiceRequestStatus.COMPLETED);
        sr.setFinalCost(dto.getFinalCost());
        sr.setResolutionSummary(dto.getResolutionSummary());

        if (sr.getProblem() != null) {
            sr.getProblem().setStatus(ProblemStatus.RESOLVED);
            problemRepository.save(sr.getProblem());
        }

        ServiceRequest updated = serviceRequestRepository.save(sr);

        // Automatically log to RepairRecord ledger
        double finalCost = dto.getFinalCost() != null ? dto.getFinalCost() : (sr.getEstimatedCost() != null ? sr.getEstimatedCost() : 0.0);
        repairRecordService.logRepair(
                sr.getCustomer(),
                sr.getAsset(),
                sr.getProblem(),
                sr,
                ResolutionType.TECHNICIAN_SERVICE,
                sr.getTitle(),
                dto.getResolutionSummary(),
                finalCost,
                30 // 30-day service warranty default
        );

        // Send completion notification to customer
        notificationService.sendNotification(
                sr.getCustomer(),
                "Repair Completed!",
                "Technician " + sr.getTechnician().getName() + " completed " + sr.getTitle() + ". Please review your service!",
                "/service-requests",
                NotificationType.REPAIR_COMPLETED
        );

        return ServiceRequestResponse.fromEntity(updated);
    }

    public ServiceRequestResponse cancelRequest(Long id, String customerEmail) {
        ServiceRequest sr = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Service request not found"));

        if (!sr.getCustomer().getEmail().equalsIgnoreCase(customerEmail)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the customer can cancel their service request");
        }

        if (sr.getStatus() != ServiceRequestStatus.REQUESTED && sr.getStatus() != ServiceRequestStatus.ACCEPTED) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Cannot cancel service request that is " + sr.getStatus());
        }

        sr.setStatus(ServiceRequestStatus.CANCELLED);
        ServiceRequest updated = serviceRequestRepository.save(sr);

        notificationService.sendNotification(
                sr.getTechnician(),
                "Service Request Cancelled",
                "Customer " + sr.getCustomer().getName() + " cancelled request: " + sr.getTitle(),
                "/service-requests",
                NotificationType.SERVICE_UPDATE
        );

        return ServiceRequestResponse.fromEntity(updated);
    }

    private ServiceRequest findAndVerifyTechnician(Long id, String technicianEmail) {
        ServiceRequest sr = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Service request not found with id: " + id));

        if (!sr.getTechnician().getEmail().equalsIgnoreCase(technicianEmail)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You are not the technician assigned to this request");
        }
        return sr;
    }
}
