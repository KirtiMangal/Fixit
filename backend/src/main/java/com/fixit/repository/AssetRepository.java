package com.fixit.repository;

import com.fixit.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {

    List<Asset> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);

    List<Asset> findByOwnerEmailOrderByCreatedAtDesc(String email);

    Optional<Asset> findByIdAndOwnerId(Long id, Long ownerId);
}
