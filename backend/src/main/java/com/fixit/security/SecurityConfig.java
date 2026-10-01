package com.fixit.security;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // Enable CORS configuration from CorsConfig.java
                .cors(Customizer.withDefaults())

                // Disable CSRF because this is a stateless REST API
                .csrf(AbstractHttpConfigurer::disable)

                // Allow H2 console frames
                .headers(headers -> headers
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::disable)
                )

                // JWT-based authentication → no server-side sessions
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Authentication and authorization error responses
                .exceptionHandling(exceptions -> exceptions

                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setContentType("application/json");
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

                            response.getWriter().write(
                                    "{\"success\":false," +
                                    "\"status\":401," +
                                    "\"error\":\"Unauthorized\"," +
                                    "\"message\":\"Full authentication is required to access this resource\"}"
                            );
                        })

                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setContentType("application/json");
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);

                            response.getWriter().write(
                                    "{\"success\":false," +
                                    "\"status\":403," +
                                    "\"error\":\"Forbidden\"," +
                                    "\"message\":\"You do not have permission to access this resource\"}"
                            );
                        })
                )

                // URL authorization rules
                .authorizeHttpRequests(auth -> auth

                        // Allow browser CORS preflight requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Health check
                        .requestMatchers("/api/health").permitAll()

                        // Authentication endpoints
                        .requestMatchers("/api/auth/**").permitAll()

                        // H2 database console
                        .requestMatchers("/h2-console/**").permitAll()

                        // Public DIY guide endpoints
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/diy-guides/**"
                        ).permitAll()

                        // Public technician endpoints
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/technicians"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/technicians/*"
                        ).permitAll()

                        // Public expert endpoints
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/experts"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/experts/*"
                        ).permitAll()

                        // Public review endpoints
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/reviews/**"
                        ).permitAll()

                        // Admin endpoints
                        .requestMatchers("/api/admin/**")
                        .hasRole("ADMIN")

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                )

                // JWT authentication filter
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {

        return configuration.getAuthenticationManager();
    }
}