package com.fixit.service;

import com.fixit.dto.RecommendationDto;
import com.fixit.entity.Asset;
import com.fixit.entity.ProblemCategory;
import com.fixit.repository.AssetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class RecommendationService {

    private final AssetRepository assetRepository;

    public RecommendationService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    public List<RecommendationDto> getRecommendations(String email) {
        List<RecommendationDto> list = new ArrayList<>();
        List<Asset> userAssets = assetRepository.findByOwnerEmailOrderByCreatedAtDesc(email);

        // Generate tailored asset recommendations
        for (Asset a : userAssets) {
            ProblemCategory cat = a.getCategory();
            String name = a.getName() + " (" + (a.getBrand() != null ? a.getBrand() : "") + " " + (a.getModel() != null ? a.getModel() : "") + ")";

            if (cat == ProblemCategory.LAPTOP) {
                list.add(new RecommendationDto(
                        "rec-laptop-" + a.getId(),
                        "Thermal Paste Refresh & Dust Evacuation",
                        "Laptops accumulate lint against exhaust heat sinks within 6-12 months, causing thermal throttling and battery wear.",
                        ProblemCategory.LAPTOP,
                        "MEDIUM",
                        "DIY",
                        "/diy-guides?category=LAPTOP",
                        a.getId(),
                        name
                ));
            } else if (cat == ProblemCategory.MOBILE) {
                list.add(new RecommendationDto(
                        "rec-mob-" + a.getId(),
                        "Charging Port Lint Cleaning & Battery Health Audit",
                        "Pocket lint buildup insulates charging contacts, increasing charging resistance and port temperature.",
                        ProblemCategory.MOBILE,
                        "LOW",
                        "DIY",
                        "/diy-guides?category=MOBILE",
                        a.getId(),
                        name
                ));
            } else if (cat == ProblemCategory.HOME_APPLIANCE) {
                list.add(new RecommendationDto(
                        "rec-app-" + a.getId(),
                        "Condenser Coil & Drainage Inspection",
                        "Dust-choked condenser coils double motor compressor electricity consumption and cause premature thermal fuse tripping.",
                        ProblemCategory.HOME_APPLIANCE,
                        "MEDIUM",
                        "MAINTENANCE",
                        "/maintenance",
                        a.getId(),
                        name
                ));
            } else if (cat == ProblemCategory.VEHICLE) {
                list.add(new RecommendationDto(
                        "rec-veh-" + a.getId(),
                        "Brake Rotor & Fluid Contamination Check",
                        "Brake fluid absorbs atmospheric moisture over time, reducing boiling point and stopping efficacy.",
                        ProblemCategory.VEHICLE,
                        "HIGH",
                        "INSPECTION",
                        "/technicians?category=VEHICLE",
                        a.getId(),
                        name
                ));
            }
        }

        // Add universal best-practice recommendations if list is small
        if (list.size() < 3) {
            list.add(new RecommendationDto(
                    "rec-gen-plumb",
                    "Quarterly Plumbing Angle Stop Valve Cycling",
                    "Quarter-turn shutoff valves seize from mineral deposits if never turned. Exercise them twice a year to prevent sudden catastrophic leaks.",
                    ProblemCategory.PLUMBING,
                    "MEDIUM",
                    "DIY",
                    "/diy-guides?category=PLUMBING",
                    null,
                    "General Plumbing"
            ));

            list.add(new RecommendationDto(
                    "rec-gen-elec",
                    "GFCI / RCD Breaker Tripping Safety Test",
                    "Press the 'TEST' button on your bathroom/kitchen GFCI outlets to verify trip mechanisms operate in milliseconds.",
                    ProblemCategory.ELECTRICAL,
                    "HIGH",
                    "MAINTENANCE",
                    "/maintenance",
                    null,
                    "Home Electrical Safety"
            ));
        }

        return list;
    }
}
