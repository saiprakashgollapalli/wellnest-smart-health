package com.wellnest.dto;

import com.wellnest.entity.User;
import jakarta.validation.constraints.*;
import lombok.*;

public class AuthDto {

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
        // Less strict password for easier testing - remove if you want strict validation
        // @Pattern(
        //     regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
        //     message = "Password must contain uppercase, lowercase, number and special character"
        // )
        private String password;

        private User.Role role = User.Role.USER;
        private User.Gender gender;

        // Prevent ADMIN role during registration
        public void setRole(User.Role role) {
            if (role == User.Role.ADMIN) {
                this.role = User.Role.USER;
            } else {
                this.role = role;
            }
        }
    }

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