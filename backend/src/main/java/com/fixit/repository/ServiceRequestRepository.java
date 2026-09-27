package com.fixit.repository;

import com.fixit.entity.ServiceRequest;
import com.fixit.entity.ServiceRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    List<ServiceRequest> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail);

    List<ServiceRequest> findByTechnicianEmailOrderByCreatedAtDesc(String technicianEmail);

    List<ServiceRequest> findByProblemIdOrderByCreatedAtDesc(Long problemId);

    List<ServiceRequest> findByAssetIdOrderByCreatedAtDesc(Long assetId);

    long countByTechnicianEmailAndStatus(String technicianEmail, ServiceRequestStatus status);

    long countByCustomerEmailAndStatus(String customerEmail, ServiceRequestStatus status);
}
