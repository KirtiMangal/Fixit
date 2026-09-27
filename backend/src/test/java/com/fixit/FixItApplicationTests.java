package com.fixit;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("local")
class FixItApplicationTests {

    @Test
    void contextLoads() {
        // Verifies the application context loads successfully with all beans, repositories, and services
    }
}
