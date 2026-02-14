package com.wellnest.dto;

import com.wellnest.entity.SleepLog;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * DTOs for Nutrition and Sleep tracking.
 */
public class TrackingDto {

    // ─── Nutrition Log DTO ───────────────────────────────────────────────────
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NutritionLogDto {

        private Long id;

        @NotBlank(message = "Meal type is required")
        private String mealType;

        @NotBlank(message = "Food items are required")
        @Size(max = 500, message = "Food items description is too long")
        private String foodItems;

        @Min(value = 0, message = "Calories cannot be negative")
        private Integer caloriesConsumed;

        @DecimalMin(value = "0.0", message = "Protein cannot be negative")
        private Double proteinGrams;

        @DecimalMin(value = "0.0", message = "Carbs cannot be negative")
        private Double carbsGrams;

        @DecimalMin(value = "0.0", message = "Fat cannot be negative")
        private Double fatGrams;

        @NotNull(message = "Date is required")
        private LocalDate date;

        private Long userId;
    }

    // ─── Sleep Log DTO ───────────────────────────────────────────────────────
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SleepLogDto {

        private Long id;

        @NotNull(message = "Date is required")
        private LocalDate date;

        private LocalTime bedTime;
        private LocalTime wakeTime;

        @NotNull(message = "Sleep hours is required")
        @DecimalMin(value = "0.0", message = "Sleep hours cannot be negative")
        @DecimalMax(value = "24.0", message = "Sleep hours cannot exceed 24")
        private Double sleepHours;

        private SleepLog.SleepQuality sleepQuality;

        @Size(max = 300, message = "Notes cannot exceed 300 characters")
        private String notes;

        private Long userId;
    }
}