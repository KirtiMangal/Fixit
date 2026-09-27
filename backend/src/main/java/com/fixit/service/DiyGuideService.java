package com.fixit.service;

import com.fixit.dto.DiyGuideResponse;
import com.fixit.entity.*;
import com.fixit.exception.ApiException;
import com.fixit.repository.AssetRepository;
import com.fixit.repository.DiyGuideRepository;
import com.fixit.repository.UserGuideCompletionRepository;
import com.fixit.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DiyGuideService {

    private final DiyGuideRepository diyGuideRepository;
    private final UserGuideCompletionRepository completionRepository;
    private final UserRepository userRepository;
    private final AssetRepository assetRepository;
    private final RepairRecordService repairRecordService;
    private final NotificationService notificationService;

    public DiyGuideService(DiyGuideRepository diyGuideRepository,
                           UserGuideCompletionRepository completionRepository,
                           UserRepository userRepository,
                           AssetRepository assetRepository,
                           RepairRecordService repairRecordService,
                           NotificationService notificationService) {
        this.diyGuideRepository = diyGuideRepository;
        this.completionRepository = completionRepository;
        this.userRepository = userRepository;
        this.assetRepository = assetRepository;
        this.repairRecordService = repairRecordService;
        this.notificationService = notificationService;
    }

    @PostConstruct
    public void seedDefaultGuides() {
        if (diyGuideRepository.count() == 0) {
            diyGuideRepository.save(new DiyGuide(
                    "Laptop Fan Cleaning & Heatsink De-dusting",
                    "Overheating laptops and loud fans are frequently caused by lint trapped against the copper cooling fins. This guide walks you through safely cleaning the fan without damaging bearings.",
                    ProblemCategory.LAPTOP,
                    DifficultyLevel.EASY,
                    20,
                    Arrays.asList("Can of compressed air", "Phillips #00 precision screwdriver", "Anti-static wrist strap / ground contact", "Soft bristle brush"),
                    Arrays.asList("Always power off the machine and unplug the AC power cord.", "Hold the fan blades still with a toothpick when blowing air; letting the fan free-spin at high speed can induce back-EMF voltage that damages the motherboard."),
                    Arrays.asList(
                            "Power down the laptop, unplug all cables, and place the laptop bottom-up on a clean, flat surface.",
                            "Remove the perimeter bottom screws. Keep them organized by length as screw depths often vary.",
                            "Use a plastic pry tool to gently release the chassis retaining clips.",
                            "Locate the cooling fan and copper heat pipe assembly.",
                            "Hold the fan rotor stationary with a clean toothpick and direct short 2-second bursts of compressed air through the heatsink exhaust fins outward.",
                            "Gently brush away dislodged debris with a soft bristle brush.",
                            "Snap the chassis cover back in place, reinstall all screws, and test boot while monitoring idle temperatures."
                    )
            ));

            diyGuideRepository.save(new DiyGuide(
                    "Smartphone Charging Port Lint Cleanout",
                    "If your charging cable feels loose, wobbly, or intermittently stops charging, compacted pocket lint inside the port is the most common culprit.",
                    ProblemCategory.MOBILE,
                    DifficultyLevel.EASY,
                    10,
                    Arrays.asList("Wooden toothpick or non-conductive plastic probe", "Flashlight / phone camera light", "Canned air or hand blower"),
                    Arrays.asList("NEVER use a metal safety pin, needle, or conductive wire inside the charging port; shorting the power pins will destroy the charge controller IC."),
                    Arrays.asList(
                            "Power down your mobile phone completely.",
                            "Shine a bright flashlight directly into the USB-C or Lightning port to inspect the bottom corners.",
                            "Insert a wooden toothpick gently along the back wall, keeping clear of the center contact pin tongue.",
                            "Gently scrape outward from the inner corners to scoop out compacted cotton and lint.",
                            "Use a short burst of canned air to blow away free particles.",
                            "Plug in your original charging cable; the connector should now 'click' snugly into place and initiate fast charging."
                    )
            ));

            diyGuideRepository.save(new DiyGuide(
                    "Fixing a Dripping Sink Compression Faucet",
                    "A persistent faucet drip wastes dozens of gallons of water daily and stains fixtures. Replacing worn neoprene O-rings and washers restores leak-free operation.",
                    ProblemCategory.PLUMBING,
                    DifficultyLevel.MODERATE,
                    30,
                    Arrays.asList("Adjustable wrench", "Flathead and Phillips screwdrivers", "Replacement washer & O-ring kit", "Silicone plumber's grease"),
                    Arrays.asList("CRITICAL: Shut off the cold and hot water angle stop valves beneath the sink before loosening any fixture bolt."),
                    Arrays.asList(
                            "Locate the hot and cold water shutoff valves under the sink and turn clockwise until tight.",
                            "Open the faucet handles to bleed residual water pressure and verify the flow has completely ceased.",
                            "Pop off the decorative handle index caps using a thin flathead screwdriver.",
                            "Unscrew the handle retaining screw and pull the handle assembly off the stem.",
                            "Use an adjustable wrench to loosen and unscrew the brass packing nut and cartridge.",
                            "Inspect the bottom rubber washer. If flattened, grooved, or cracked, replace it with an exact match.",
                            "Coat new rubber O-rings lightly with food-grade plumber's silicone grease.",
                            "Reassemble the stem, tighten the packing nut snugly (do not overtighten), turn water back on, and inspect for leaks."
                    )
            ));

            diyGuideRepository.save(new DiyGuide(
                    "Refrigerator Condenser Coil Cleaning & Maintenance",
                    "Clogged refrigerator condenser coils force the compressor to run continuously, doubling electricity consumption and eventually causing compressor burnout.",
                    ProblemCategory.HOME_APPLIANCE,
                    DifficultyLevel.EASY,
                    25,
                    Arrays.asList("Coil cleaning brush", "Vacuum cleaner with narrow crevice hose attachment", "Work gloves"),
                    Arrays.asList("Always unplug the refrigerator from the wall outlet before removing the toe kick grill or rear service panel."),
                    Arrays.asList(
                            "Unplug the refrigerator from the wall power outlet.",
                            "Remove the front bottom toe kick grill by snapping it forward, or pull the unit out to access the rear panel.",
                            "Use the long flexible coil brush to gently scrape accumulated pet hair and dust off the metal coils.",
                            "Follow immediately with the vacuum crevice tool to capture dislodged dirt without letting it circulate into the air.",
                            "Vacuum the compressor drip tray and fan blades.",
                            "Re-attach the grill panel, plug the refrigerator back in, and enjoy lower compressor runtimes and reduced electric bills."
                    )
            ));

            diyGuideRepository.save(new DiyGuide(
                    "Replacing a Blown Automotive Auxiliary Fuse",
                    "When car 12V sockets, interior dome lights, or the radio suddenly cut out, a blown spade fuse is the most common and inexpensive cause.",
                    ProblemCategory.VEHICLE,
                    DifficultyLevel.EASY,
                    15,
                    Arrays.asList("Fuse puller tool (usually located inside fuse box lid)", "Replacement blade fuse matching exact amperage rating", "Owner manual fuse diagram"),
                    Arrays.asList("Always replace a fuse with one of the EXACT same amperage (e.g., 10A Red, 15A Blue). Installing a higher amperage fuse risks electrical fire."),
                    Arrays.asList(
                            "Turn off the car ignition and remove the key.",
                            "Locate the interior fuse box (typically under the driver dashboard) or engine bay fuse box.",
                            "Refer to the fuse index diagram on the panel cover to locate the fuse corresponding to the non-working circuit.",
                            "Use the plastic fuse puller clip to pull the fuse straight out.",
                            "Inspect the translucent plastic body: if the internal metal strip is burned or broken, the fuse is blown.",
                            "Press the replacement fuse firmly into the identical socket.",
                            "Turn the ignition on to test the circuit. If the fuse immediately blows again, consult a professional mechanic for a short circuit."
                    )
            ));
        }
    }

    public List<DiyGuideResponse> getGuides(ProblemCategory category, DifficultyLevel difficulty, String search, String userEmail) {
        List<DiyGuide> list = diyGuideRepository.filterGuides(category, difficulty, (search != null && !search.isBlank()) ? search : null);

        User currentUser = null;
        if (userEmail != null) {
            currentUser = userRepository.findByEmail(userEmail).orElse(null);
        }
        final User user = currentUser;

        return list.stream().map(g -> {
            boolean done = false;
            if (user != null) {
                done = completionRepository.existsByUserIdAndGuideId(user.getId(), g.getId());
            }
            return DiyGuideResponse.fromEntity(g, done);
        }).collect(Collectors.toList());
    }

    public DiyGuideResponse getGuideById(Long id, String userEmail) {
        DiyGuide guide = diyGuideRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "DIY Guide not found with id: " + id));

        guide.setViewsCount(guide.getViewsCount() + 1);
        diyGuideRepository.save(guide);

        boolean done = false;
        if (userEmail != null) {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user != null) {
                done = completionRepository.existsByUserIdAndGuideId(user.getId(), guide.getId());
            }
        }

        return DiyGuideResponse.fromEntity(guide, done);
    }

    public DiyGuideResponse completeGuide(Long id, String userEmail, Long assetId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        DiyGuide guide = diyGuideRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "DIY Guide not found with id: " + id));

        if (!completionRepository.existsByUserIdAndGuideId(user.getId(), guide.getId())) {
            completionRepository.save(new UserGuideCompletion(user, guide));
            guide.setCompletionCount(guide.getCompletionCount() + 1);
            diyGuideRepository.save(guide);

            Asset asset = null;
            if (assetId != null) {
                asset = assetRepository.findById(assetId).orElse(null);
            }

            // Automatically log a Repair Record for the user!
            repairRecordService.logRepair(
                    user,
                    asset,
                    null,
                    null,
                    ResolutionType.DIY_GUIDE,
                    "DIY Repair: " + guide.getTitle(),
                    "Successfully resolved issue using FixIt DIY Guide: " + guide.getTitle(),
                    0.0,
                    180
            );

            notificationService.sendNotification(
                    user,
                    "🎉 DIY Repair Logged!",
                    "You completed the DIY repair '" + guide.getTitle() + "'. A $0 repair record was added to your history.",
                    "/repairs",
                    NotificationType.SYSTEM
            );
        }

        return DiyGuideResponse.fromEntity(guide, true);
    }
}
