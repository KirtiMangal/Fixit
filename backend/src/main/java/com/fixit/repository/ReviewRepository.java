package com.fixit.repository;

import com.fixit.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByTargetUserIdOrderByCreatedAtDesc(Long targetUserId);

    boolean existsByServiceRequestId(Long serviceRequestId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.targetUser.id = :targetUserId")
    Double calculateAverageRating(@Param("targetUserId") Long targetUserId);

    long countByTargetUserId(Long targetUserId);
}
