package com.fixit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fixit.dto.CreateMaintenanceReminderDto;
import com.fixit.dto.LoginRequest;
import com.fixit.dto.RegisterRequest;
import com.fixit.entity.ProblemCategory;
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

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("local")
class MaintenanceReminderIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String registerAndGetToken(String email) throws Exception {
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setName("Maintenance User");
        registerReq.setEmail(email);
        registerReq.setPassword("Password123!");
        registerReq.setPhone("+1234567890");
        registerReq.setRole(Role.CUSTOMER);

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
    @DisplayName("Should create recurring reminder and automatically schedule next due date upon completion")
    void testRecurringReminderAutoScheduling() throws Exception {
        String email = "maint_" + System.currentTimeMillis() + "@test.com";
        String token = registerAndGetToken(email);

        CreateMaintenanceReminderDto dto = new CreateMaintenanceReminderDto();
        dto.setTitle("Replace AC Filter");
        dto.setDescription("Clean dust pre-filters and install new HEPA filter cartridge");
        dto.setCategory(ProblemCategory.HOME_APPLIANCE);
        dto.setDueDate(Instant.now().plus(7, ChronoUnit.DAYS));
        dto.setRecurrenceDays(90);

        MvcResult createResult = mockMvc.perform(post("/api/maintenance-reminders")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.status").value("PENDING"))
                .andExpect(jsonPath("$.data.recurrenceDays").value(90))
                .andReturn();

        long reminderId = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("data").get("id").asLong();

        // Complete the reminder
        mockMvc.perform(put("/api/maintenance-reminders/" + reminderId + "/complete")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("COMPLETED"));

        // Verify that a new recurring reminder was automatically scheduled
        MvcResult listResult = mockMvc.perform(get("/api/maintenance-reminders")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andReturn();

        String listJson = listResult.getResponse().getContentAsString();
        // Should have at least 2 reminders now: the completed one and the new pending recurring one
        assertThat(listJson).contains("COMPLETED");
        assertThat(listJson).contains("PENDING");
    }
}
