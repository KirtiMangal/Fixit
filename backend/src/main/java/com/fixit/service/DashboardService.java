package com.fixit.service;

import com.fixit.dto.DashboardSummaryResponse;
import com.fixit.dto.MaintenanceReminderResponse;
import com.fixit.dto.RepairRecordResponse;
import com.fixit.dto.ServiceRequestResponse;
import com.fixit.entity.ReminderStatus;
import com.fixit.entity.ServiceRequestStatus;
import com.fixit.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final AssetRepository assetRepository;
    private final ProblemRepository problemRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final MaintenanceReminderRepository reminderRepository;
    private final RepairRecordRepository repairRecordRepository;
    private final RepairRecordService repairRecordService;

    public DashboardService(AssetRepository assetRepository,
                            ProblemRepository problemRepository,
                            ServiceRequestRepository serviceRequestRepository,
                            MaintenanceReminderRepository reminderRepository,
                            RepairRecordRepository repairRecordRepository,
                            RepairRecordService repairRecordService) {
        this.assetRepository = assetRepository;
        this.problemRepository = problemRepository;
        this.serviceRequestRepository = serviceRequestRepository;
        this.reminderRepository = reminderRepository;
        this.repairRecordRepository = repairRecordRepository;
        this.repairRecordService = repairRecordService;
    }

    public DashboardSummaryResponse getSummary(String email) {
        DashboardSummaryResponse res = new DashboardSummaryResponse();

        res.setMyThingsCount(assetRepository.findByOwnerEmailOrderByCreatedAtDesc(email).size());
        res.setMyProblemsCount(problemRepository.findByCreatedByEmailOrderByCreatedAtDesc(email).size());

        List<ServiceRequestResponse> allRequests = serviceRequestRepository.findByCustomerEmailOrderByCreatedAtDesc(email)
                .stream().map(ServiceRequestResponse::fromEntity).collect(Collectors.toList());

        long activeReqs = allRequests.stream()
                .filter(r -> r.getStatus() == ServiceRequestStatus.REQUESTED ||
                             r.getStatus() == ServiceRequestStatus.ACCEPTED ||
                             r.getStatus() == ServiceRequestStatus.IN_PROGRESS)
                .count();
        res.setActiveServiceRequestsCount(activeReqs);
        res.setRecentRequests(allRequests.stream().limit(3).collect(Collectors.toList()));

        List<MaintenanceReminderResponse> reminders = reminderRepository.findByUserEmailOrderByDueDateAsc(email)
                .stream().map(MaintenanceReminderResponse::fromEntity).collect(Collectors.toList());

        long pendingReminders = reminders.stream()
                .filter(r -> r.getStatus() == ReminderStatus.PENDING || r.getStatus() == ReminderStatus.OVERDUE)
                .count();
        res.setUpcomingRemindersCount(pendingReminders);
        res.setUpcomingReminders(reminders.stream()
                .filter(r -> r.getStatus() == ReminderStatus.PENDING || r.getStatus() == ReminderStatus.OVERDUE)
                .limit(4).collect(Collectors.toList()));

        List<RepairRecordResponse> repairs = repairRecordRepository.findByUserEmailOrderByRepairedAtDesc(email)
                .stream().map(RepairRecordResponse::fromEntity).collect(Collectors.toList());
        res.setCompletedRepairsCount(repairs.size());
        res.setRecentRepairs(repairs.stream().limit(3).collect(Collectors.toList()));

        var stats = repairRecordService.getStats(email);
        res.setTotalSpent(stats.getTotalSpent());
        res.setEstimatedSavings(stats.getEstimatedSavings());

        return res;
    }
}
