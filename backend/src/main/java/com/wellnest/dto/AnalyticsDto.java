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

    // ================= SUMMARY CARDS =================

    private Double avgSleepHours;
    private Integer totalCaloriesBurned;
    private Integer totalCaloriesConsumed;
    private Integer totalWorkoutMinutes;
    private Integer workoutCount;
    private Integer todayCaloriesBurned;
    private Double todayHydrationLiters;
    private Double hydrationLiters;
    private Integer stepsToday;

    // ================= HEALTH SCORE =================

    private Integer healthScore;
    private String healthInsight;

    // ================= MOOD =================

    private String moodStatus;

    // ================= STREAK DATA =================

    private Integer currentStreak;

    private List<Boolean> weeklyStreak;

    private List<Boolean> monthlyStreak;

    // ================= WEEKLY DATA =================

    private List<Map<String, Object>> weeklyWorkoutData;

    private List<Map<String, Object>> weeklySleepData;

    // ================= MONTHLY DATA =================

    private List<Map<String, Object>> monthlyCalorieTrend;

    // ================= BMI =================

    private Double bmi;
    private String bmiCategory;
}