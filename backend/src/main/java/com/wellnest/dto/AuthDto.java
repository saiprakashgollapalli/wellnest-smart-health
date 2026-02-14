package com.wellnest.dto;

import com.wellnest.entity.User;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * DTOs for Authentication (Register & Login).
 */
public class AuthDto {

    // ─── Register Request ───────────────────────────────────────────────────
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RegisterRequest {

        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 50, message = "Name must be 2–50 characters")
        private String name;

        @NotBlank(message = "Email is required")
        @Email(message = "Please provide a valid email address")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "Password must contain uppercase, lowercase, number and special character"
        )
        private String password;

        private User.Role role = User.Role.USER;
        private User.Gender gender;

    }

    // ─── Login Request ───────────────────────────────────────────────────────
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {

        @NotBlank(message = "Email is required")
        @Email(message = "Please provide a valid email address")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    // ─── Auth Response ───────────────────────────────────────────────────────
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuthResponse {
        private String token;
        private String type = "Bearer";
        private Long userId;
        private String name;
        private String email;
        private String role;
        private Boolean hasProfile;
    }
}