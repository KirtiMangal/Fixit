package com.fixit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fixit.dto.*;
import com.fixit.entity.ProblemCategory;
import com.fixit.entity.ProblemSeverity;
import com.fixit.entity.Role;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("local")
class ProblemAndDiagnosisIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String registerAndGetToken(String email, Role role) throws Exception {
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setName("User " + email);
        registerReq.setEmail(email);
        registerReq.setPassword("Password123!");
        registerReq.setPhone("+1987654321");
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
    @DisplayName("Should create asset, report problem, execute AI diagnosis with fallback, and enforce IDOR")
    void testProblemReportingAiDiagnosisAndIdor() throws Exception {
        String userAEmail = "userA_" + System.currentTimeMillis() + "@test.com";
        String tokenA = registerAndGetToken(userAEmail, Role.CUSTOMER);

        // 1. Create Asset for User A
        CreateAssetRequest assetReq = new CreateAssetRequest();
        assetReq.setName("Workstation Laptop");
        assetReq.setCategory(ProblemCategory.LAPTOP);
        assetReq.setBrand("Lenovo");
        assetReq.setModel("ThinkPad X1");
        assetReq.setPurchaseDate(LocalDate.now().minusMonths(6));

        MvcResult assetResult = mockMvc.perform(post("/api/assets")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(assetReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").isNumber())
                .andReturn();

        long assetId = objectMapper.readTree(assetResult.getResponse().getContentAsString())
                .get("data").get("id").asLong();

        // 2. Report Problem linked to Asset
        CreateProblemRequest probReq = new CreateProblemRequest();
        probReq.setTitle("Display flickering and horizontal lines");
        probReq.setDescription("Intermittent flickering when opening the hinge past 90 degrees");
        probReq.setCategory(ProblemCategory.LAPTOP);
        probReq.setSubcategory("Screen / Display");
        probReq.setSeverity(ProblemSeverity.MEDIUM);
        probReq.setAssetId(assetId);

        MvcResult probResult = mockMvc.perform(post("/api/problems")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(probReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.status").value("REPORTED"))
                .andExpect(jsonPath("$.data.asset.id").value(assetId))
                .andReturn();

        long problemId = objectMapper.readTree(probResult.getResponse().getContentAsString())
                .get("data").get("id").asLong();

        // 3. Trigger AI Diagnosis (resilient heuristic fallback when microservice is offline)
        mockMvc.perform(post("/api/problems/" + problemId + "/diagnose")
                        .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("DIAGNOSED"))
                .andExpect(jsonPath("$.data.diagnosis").exists())
                .andExpect(jsonPath("$.data.diagnosis.summary").isNotEmpty())
                .andExpect(jsonPath("$.data.diagnosis.possibleCauses").isArray());

        // 4. Test IDOR Protection: User B should NOT be able to modify or delete User A's problem
        String userBEmail = "userB_" + System.currentTimeMillis() + "@test.com";
        String tokenB = registerAndGetToken(userBEmail, Role.CUSTOMER);

        mockMvc.perform(delete("/api/problems/" + problemId)
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isForbidden());

        // 5. Test Similar Problems Discovery
        mockMvc.perform(get("/api/problems/" + problemId + "/similar")
                        .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
    }
}
