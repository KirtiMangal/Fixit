package com.fixit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fixit.dto.*;
import com.fixit.entity.ProblemCategory;
import com.fixit.entity.Role;
import com.fixit.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("local")
class ServiceLifecycleIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    private String registerAndGetToken(String email, Role role) throws Exception {
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setName("User " + email);
        registerReq.setEmail(email);
        registerReq.setPassword("Password123!");
        registerReq.setPhone("+1234567890");
        registerReq.setRole(role);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated());

        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail(email);
        loginReq.setPassword("Password123!");

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn();

        return objectMapper.readTree(result.getResponse().getContentAsString())
                .get("data").get("token").asText();
    }

    @Test
    @DisplayName("Should execute complete service lifecycle: Request -> Accept -> Start -> Complete -> RepairRecord -> Review")
    void testServiceRequestLifecycleAndReview() throws Exception {
        String custEmail = "cust_" + System.currentTimeMillis() + "@test.com";
        String techEmail = "tech_" + System.currentTimeMillis() + "@test.com";

        String custToken = registerAndGetToken(custEmail, Role.CUSTOMER);
        String techToken = registerAndGetToken(techEmail, Role.TECHNICIAN);

        Long techUserId = userRepository.findByEmail(techEmail).orElseThrow().getId();

        // 1. Customer creates a service request
        CreateServiceRequestDto createDto = new CreateServiceRequestDto();
        createDto.setTechnicianId(techUserId);
        createDto.setTitle("Refrigerator compressor not kicking in");
        createDto.setDescription("Temperature rising; compressor clicks every few minutes");
        createDto.setCategory(ProblemCategory.HOME_APPLIANCE);
        createDto.setScheduledDate(Instant.now().plus(2, ChronoUnit.DAYS));
        createDto.setEstimatedCost(150.0);
        createDto.setCustomerNotes("Please call before arriving");

        MvcResult createResult = mockMvc.perform(post("/api/service-requests")
                        .header("Authorization", "Bearer " + custToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.status").value("REQUESTED"))
                .andReturn();

        long requestId = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("data").get("id").asLong();

        // 2. Technician accepts the request
        mockMvc.perform(put("/api/service-requests/" + requestId + "/accept")
                        .header("Authorization", "Bearer " + techToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("ACCEPTED"));

        // 3. Technician starts work
        mockMvc.perform(put("/api/service-requests/" + requestId + "/start")
                        .header("Authorization", "Bearer " + techToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("IN_PROGRESS"));

        // 4. Technician completes work
        CompleteServiceRequestDto completeDto = new CompleteServiceRequestDto();
        completeDto.setFinalCost(165.0);
        completeDto.setResolutionSummary("Replaced start relay and run capacitor. Refrigeration cycle nominal.");

        mockMvc.perform(put("/api/service-requests/" + requestId + "/complete")
                        .header("Authorization", "Bearer " + techToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(completeDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("COMPLETED"))
                .andExpect(jsonPath("$.data.finalCost").value(165.0));

        // 5. Verify automatic repair record was logged in customer's repair history
        mockMvc.perform(get("/api/repair-records/my")
                        .header("Authorization", "Bearer " + custToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].resolutionType").value("TECHNICIAN_SERVICE"))
                .andExpect(jsonPath("$.data[0].cost").value(165.0));

        // 6. Customer submits review
        CreateReviewDto reviewDto = new CreateReviewDto();
        reviewDto.setServiceRequestId(requestId);
        reviewDto.setRating(5);
        reviewDto.setComment("Prompt arrival and diagnosed the relay fault immediately. Excellent technician!");

        mockMvc.perform(post("/api/reviews")
                        .header("Authorization", "Bearer " + custToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reviewDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.rating").value(5));

        // 7. Duplicate review should be rejected
        mockMvc.perform(post("/api/reviews")
                        .header("Authorization", "Bearer " + custToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reviewDto)))
                .andExpect(status().isBadRequest());
    }
}
