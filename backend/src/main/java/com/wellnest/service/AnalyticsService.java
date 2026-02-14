package com.wellnest.service;

import com.wellnest.dto.AnalyticsDto;
import com.wellnest.entity.Profile;
import com.wellnest.entity.Workout;
import com.wellnest.entity.SleepLog;
import com.wellnest.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;

/**
 * Analytics service – aggregates health data for the dashboard.
 * Mock data is returned for steps, mood, and hydration (external API placeholders).
 */
@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final WorkoutRepository workoutRepository;
    private final NutritionLogRepository nutritionLogRepository;
    private final SleepLogRepository sleepLogRepository;
    private final ProfileRepository profileRepository;

    @Transactional(readOnly = true)
    public AnalyticsDto getDashboardAnalytics(Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.with(DayOfWeek.MONDAY);
        LocalDate monthStart = today.withDayOfMonth(1);

        // ── Weekly aggregates ─────────────────────────────────────────────────
        Integer weeklyCaloriesBurned = workoutRepository
                .sumCaloriesBurnedByUserIdAndDateBetween(userId, weekStart, today);
        Integer weeklyCaloriesConsumed = nutritionLogRepository
                .sumCaloriesConsumedByUserIdAndDateBetween(userId, weekStart, today);
        Integer totalWorkoutMinutes = workoutRepository
                .sumDurationByUserIdAndDateBetween(userId, weekStart, today);
        Double avgSleepHours = sleepLogRepository
                .avgSleepHoursByUserIdAndDateBetween(userId, monthStart, today);

        long workoutCount = workoutRepository
                .findByUserIdAndDateBetween(userId, weekStart, today).size();

        // ── Weekly chart data ─────────────────────────────────────────────────
        List<Map<String, Object>> weeklyWorkoutData = buildWeeklyWorkoutData(userId, weekStart);
        List<Map<String, Object>> weeklySleepData = buildWeeklySleepData(userId, weekStart);
        List<Map<String, Object>> monthlyCalorieTrend = buildMonthlyCalorieTrend(userId, today);

        // ── BMI ───────────────────────────────────────────────────────────────
        double bmi = 0.0;
        String bmiCategory = "Unknown";
        Optional<Profile> profileOpt = profileRepository.findByUserId(userId);
        if (profileOpt.isPresent()) {
            Profile p = profileOpt.get();
            double heightM = p.getHeight() / 100.0;
            bmi = Math.round((p.getWeight() / (heightM * heightM)) * 10.0) / 10.0;
            bmiCategory = categorizeBmi(bmi);
        }

        // ── Mock external API data ────────────────────────────────────────────
        return AnalyticsDto.builder()
                .avgSleepHours(avgSleepHours != null ? Math.round(avgSleepHours * 10.0) / 10.0 : 0.0)
                .totalCaloriesBurned(weeklyCaloriesBurned != null ? weeklyCaloriesBurned : 0)
                .totalCaloriesConsumed(weeklyCaloriesConsumed != null ? weeklyCaloriesConsumed : 0)
                .totalWorkoutMinutes(totalWorkoutMinutes != null ? totalWorkoutMinutes : 0)
                .workoutCount((int) workoutCount)
                // Mock data for steps, mood, hydration
                .stepsToday(7842)
                .moodStatus("Good")
                .hydrationLiters(2.1)
                .weeklyWorkoutData(weeklyWorkoutData)
                .weeklySleepData(weeklySleepData)
                .monthlyCalorieTrend(monthlyCalorieTrend)
                .bmi(bmi)
                .bmiCategory(bmiCategory)
                .build();
    }

    /** Build per-day workout data for the current week. */
    private List<Map<String, Object>> buildWeeklyWorkoutData(Long userId, LocalDate weekStart) {
        List<Map<String, Object>> result = new ArrayList<>();
        List<Workout> workouts = workoutRepository
                .findByUserIdAndDateBetween(userId, weekStart, weekStart.plusDays(6));

        for (int i = 0; i < 7; i++) {
            LocalDate day = weekStart.plusDays(i);
            String dayName = day.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

            int calories = workouts.stream()
                    .filter(w -> w.getDate().equals(day))
                    .mapToInt(w -> w.getCaloriesBurned() != null ? w.getCaloriesBurned() : 0)
                    .sum();
            int duration = workouts.stream()
                    .filter(w -> w.getDate().equals(day))
                    .mapToInt(Workout::getDuration)
                    .sum();

            Map<String, Object> point = new HashMap<>();
            point.put("day", dayName);
            point.put("calories", calories);
            point.put("duration", duration);
            result.add(point);
        }
        return result;
    }

    /** Build per-day sleep data for the current week. */
    private List<Map<String, Object>> buildWeeklySleepData(Long userId, LocalDate weekStart) {
        List<Map<String, Object>> result = new ArrayList<>();
        List<SleepLog> sleepLogs = sleepLogRepository
                .findByUserIdAndDateBetween(userId, weekStart, weekStart.plusDays(6));

        for (int i = 0; i < 7; i++) {
            LocalDate day = weekStart.plusDays(i);
            String dayName = day.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

            double hours = sleepLogs.stream()
                    .filter(s -> s.getDate().equals(day))
                    .mapToDouble(SleepLog::getSleepHours)
                    .average().orElse(0.0);

            Map<String, Object> point = new HashMap<>();
            point.put("day", dayName);
            point.put("hours", Math.round(hours * 10.0) / 10.0);
            result.add(point);
        }
        return result;
    }

    /** Build monthly calorie trend broken into 4 weekly buckets. */
    private List<Map<String, Object>> buildMonthlyCalorieTrend(Long userId, LocalDate today) {
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDate monthStart = today.withDayOfMonth(1);

        for (int week = 0; week < 4; week++) {
            LocalDate start = monthStart.plusWeeks(week);
            LocalDate end = start.plusDays(6);
            if (start.isAfter(today)) break;
            if (end.isAfter(today)) end = today;

            Integer calories = nutritionLogRepository
                    .sumCaloriesConsumedByUserIdAndDateBetween(userId, start, end);

            Map<String, Object> point = new HashMap<>();
            point.put("week", "Week " + (week + 1));
            point.put("calories", calories != null ? calories : 0);
            result.add(point);
        }
        return result;
    }

    private String categorizeBmi(double bmi) {
        if (bmi < 18.5)      return "Underweight";
        else if (bmi < 25.0) return "Normal";
        else if (bmi < 30.0) return "Overweight";
        else                 return "Obese";
    }
}