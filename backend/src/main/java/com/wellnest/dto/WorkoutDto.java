package com.wellnest.dto;

import com.wellnest.entity.WorkoutType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

/**
 * DTO for Workout log operations.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutDto {

    private Long id;

    @NotNull(message = "Workout type is required")
    private WorkoutType workoutType;   // ⭐ FIXED (Enum instead of String)

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer duration;

    @Min(value = 0, message = "Calories burned cannot be negative")
    private Integer caloriesBurned;

    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    private String notes;

    private Long userId;
}
