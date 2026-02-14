package com.wellnest.dto;

import com.wellnest.entity.Profile;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * DTO for Profile create/update operations.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDto {

    private Long id;

    @NotNull(message = "Age is required")
    @Min(value = 1, message = "Age must be at least 1")
    @Max(value = 120, message = "Age must be at most 120")
    private Integer age;

    @NotNull(message = "Height is required")
    @DecimalMin(value = "50.0", message = "Height must be at least 50 cm")
    @DecimalMax(value = "300.0", message = "Height must be at most 300 cm")
    private Double height;

    @NotNull(message = "Weight is required")
    @DecimalMin(value = "20.0", message = "Weight must be at least 20 kg")
    @DecimalMax(value = "500.0", message = "Weight must be at most 500 kg")
    private Double weight;

    @NotNull(message = "Fitness goal is required")
    private Profile.FitnessGoal fitnessGoal;

    private String profilePictureUrl;

    // Computed BMI (read-only)
    private Double bmi;
}