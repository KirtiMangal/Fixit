package com.fixit.repository;

import com.fixit.entity.MaintenanceReminder;
import com.fixit.entity.ReminderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface MaintenanceReminderRepository extends JpaRepository<MaintenanceReminder, Long> {

    List<MaintenanceReminder> findByUserEmailOrderByDueDateAsc(String email);

    List<MaintenanceReminder> findByAssetIdOrderByDueDateAsc(Long assetId);

    List<MaintenanceReminder> findByUserEmailAndDueDateBeforeAndStatus(String email, Instant now, ReminderStatus status);

    long countByUserEmailAndStatus(String email, ReminderStatus status);
}
