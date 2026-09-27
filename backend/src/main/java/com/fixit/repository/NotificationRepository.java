package com.fixit.repository;

import com.fixit.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipientEmailOrderByCreatedAtDesc(String email);

    long countByRecipientEmailAndIsReadFalse(String email);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.recipient.email = :email")
    void markAllReadForEmail(@Param("email") String email);
}
