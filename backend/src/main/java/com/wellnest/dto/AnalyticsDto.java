package com.wellnest.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

/**
 * DTOs for Health Analytics Dashboard.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsDto {

    // Summary cards
    private Double avgSleepHours;
    private Integer totalCaloriesBurned;
    private Integer totalCaloriesConsumed;
    private Integer totalWorkoutMinutes;
    private Integer workoutCount;

    // Mood / hydration (mocked from external API)
    private String moodStatus;
    private Double hydrationLiters;
    private Integer stepsToday;

    // Weekly workout data: [{day: "Mon", calories: 350, duration: 45}, ...]
    private List<Map<String, Object>> weeklyWorkoutData;

    // Weekly sleep data: [{day: "Mon", hours: 7.5}, ...]
    private List<Map<String, Object>> weeklySleepData;

    // Monthly calorie trend: [{week: "Week 1", calories: 2200}, ...]
    private List<Map<String, Object>> monthlyCalorieTrend;

    // BMI info
    private Double bmi;
    private String bmiCategory;
}