package com.fixit.service;

import com.fixit.dto.CreateReviewDto;
import com.fixit.dto.ReviewResponse;
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
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final TechnicianProfileRepository technicianProfileRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ReviewService(ReviewRepository reviewRepository,
                         ServiceRequestRepository serviceRequestRepository,
                         TechnicianProfileRepository technicianProfileRepository,
                         UserRepository userRepository,
                         NotificationService notificationService) {
        this.reviewRepository = reviewRepository;
        this.serviceRequestRepository = serviceRequestRepository;
        this.technicianProfileRepository = technicianProfileRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public ReviewResponse createServiceReview(CreateReviewDto dto, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        ServiceRequest sr = serviceRequestRepository.findById(dto.getServiceRequestId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Service request not found"));

        if (!sr.getCustomer().getId().equals(customer.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You can only review service requests you booked");
        }

        if (sr.getStatus() != ServiceRequestStatus.COMPLETED) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Cannot review a service that is not COMPLETED");
        }

        if (reviewRepository.existsByServiceRequestId(sr.getId())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "You have already reviewed this service request");
        }

        User technician = sr.getTechnician();
        Review review = new Review(customer, technician, sr, dto.getRating(), dto.getComment());
        Review saved = reviewRepository.save(review);

        // Update technician profile metrics
        Double avg = reviewRepository.calculateAverageRating(technician.getId());
        long count = reviewRepository.countByTargetUserId(technician.getId());

        technicianProfileRepository.findByUserId(technician.getId()).ifPresent(tp -> {
            tp.setAverageRating(avg != null ? avg : 5.0);
            tp.setReviewCount((int) count);
            technicianProfileRepository.save(tp);
        });

        notificationService.sendNotification(
                technician,
                "★ New Customer Review Received!",
                customer.getName() + " left a " + dto.getRating() + "-star review: \"" + dto.getComment() + "\"",
                "/service-requests",
                NotificationType.REVIEW_RECEIVED
        );

        return ReviewResponse.fromEntity(saved);
    }

    public List<ReviewResponse> getReviewsForUser(Long userId) {
        return reviewRepository.findByTargetUserIdOrderByCreatedAtDesc(userId).stream()
                .map(ReviewResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
