package com.wellnest.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * DTOs for Blog and Trainer modules.
 */
public class ContentDto {

    // ─── Blog DTO ─────────────────────────────────────────────────────────────
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BlogDto {

        private Long id;

        @NotBlank(message = "Title is required")
        @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
        private String title;

        @NotBlank(message = "Content is required")
        private String content;

        @NotBlank(message = "Category is required")
        private String category;

        private String thumbnailUrl;
        private String authorName;
        private LocalDateTime createdAt;
    }

    // ─── Trainer DTO ─────────────────────────────────────────────────────────
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TrainerDto {

        private Long id;

        @NotBlank(message = "Name is required")
        private String name;

        @NotBlank(message = "Specialization is required")
        private String specialization;

        @DecimalMin("0.0") @DecimalMax("5.0")
        private Double rating;

        private Integer experienceYears;

        @Email
        private String email;

        private String phoneNumber;
        private String bio;
        private String profileImageUrl;
        private Boolean isAvailable;
    }
}