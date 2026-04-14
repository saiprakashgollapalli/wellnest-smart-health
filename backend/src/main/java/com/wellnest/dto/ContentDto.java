package com.wellnest.dto;

import com.wellnest.entity.BlogStatus;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * DTOs for Blog and Trainer modules.
 * UPDATED: Added moderation fields while preserving existing fields
 */
public class ContentDto {

    // ───────────────── BLOG DTO (UPDATED) ─────────────────

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

        // Image for blog post
        private String imageUrl;

        // Author display name
        private String authorName;

        // Author ID (needed to check edit/delete permissions)
        private Long authorId;

        // Moderation status
        private BlogStatus status;

        // Likes count
        private Integer likesCount;

        // Timestamp
        private LocalDateTime createdAt;
        
        private String thumbnailUrl;
        
        // NEW: Moderation fields
        private LocalDateTime moderatedAt;
        private String moderatedBy;

        public String getThumbnailUrl() {
            return thumbnailUrl;
        }

        public void setThumbnailUrl(String thumbnailUrl) {
            this.thumbnailUrl = thumbnailUrl;
        }
    }

    // ───────────────── TRAINER DTO (UNCHANGED) ─────────────────

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

        @DecimalMin("0.0")
        @DecimalMax("5.0")
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