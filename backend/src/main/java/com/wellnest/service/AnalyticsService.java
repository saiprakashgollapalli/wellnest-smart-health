package com.wellnest.service;

import com.wellnest.dto.AnalyticsDto;
import com.wellnest.entity.Profile;
import com.wellnest.entity.SleepLog;
import com.wellnest.entity.Workout;
import com.wellnest.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final WorkoutRepository workoutRepository;
    private final NutritionLogRepository nutritionLogRepository;
    private final SleepLogRepository sleepLogRepository;
    private final ProfileRepository profileRepository;
    private final WaterIntakeRepository waterRepository;

    @Transactional(readOnly = true)
    public AnalyticsDto getDashboardAnalytics(Long userId) {

        LocalDate today = LocalDate.now();
LocalDate weekStart = today.with(DayOfWeek.MONDAY);
LocalDate monthStart = today.withDayOfMonth(1);



        Integer todayCaloriesBurned =
                Optional.ofNullable(
                        workoutRepository.sumCaloriesBurnedByUserIdAndDateBetween(userId, today, today)
                ).orElse(0);

        Double todayHydration =
                Optional.ofNullable(
                        waterRepository.findByUserIdAndDateBetween(userId, today, today)
                ).orElse(Collections.emptyList())
                        .stream()
                        .mapToDouble(w -> w.getLiters() != null ? w.getLiters() : 0.0)
                        .sum();

        Integer weeklyCaloriesBurned =
                Optional.ofNullable(
                        workoutRepository.sumCaloriesBurnedByUserIdAndDateBetween(userId, weekStart, today)
                ).orElse(0);

        Integer weeklyCaloriesConsumed =
                Optional.ofNullable(
                        nutritionLogRepository.sumCaloriesConsumedByUserIdAndDateBetween(userId, weekStart, today)
                ).orElse(0);

        Integer totalWorkoutMinutes =
                Optional.ofNullable(
                        workoutRepository.sumDurationByUserIdAndDateBetween(userId, weekStart, today)
                ).orElse(0);

        Double avgSleepHours =
                Optional.ofNullable(
                        sleepLogRepository.avgSleepHoursByUserIdAndDateBetween(userId, weekStart, today)
                ).orElse(0.0);

        List<Workout> workouts =
                Optional.ofNullable(
                        workoutRepository.findByUserIdAndDateBetween(userId, weekStart, today)
                ).orElse(Collections.emptyList());

        int workoutCount = workouts.size();

        Double weeklyHydration =
                Optional.ofNullable(
                        waterRepository.findByUserIdAndDateBetween(userId, weekStart, today)
                ).orElse(Collections.emptyList())
                        .stream()
                        .mapToDouble(w -> w.getLiters() != null ? w.getLiters() : 0.0)
                        .sum();

        int calorieBalance = weeklyCaloriesBurned - weeklyCaloriesConsumed;

        int healthScore = calculateHealthScore(
                avgSleepHours,
                weeklyHydration,
                workoutCount,
                calorieBalance
        );

        String insight = generateHealthInsight(healthScore);

        List<Map<String, Object>> weeklyWorkoutData =
                buildWeeklyWorkoutData(userId, weekStart, today);

        List<Map<String, Object>> weeklySleepData =
                buildWeeklySleepData(userId, weekStart, today);

        List<Map<String, Object>> monthlyCalorieTrend =
                buildMonthlyCalorieTrend(userId, monthStart, today);

        double bmi = 0.0;
        String bmiCategory = "Unknown";

        Optional<Profile> profileOpt = profileRepository.findByUserId(userId);

        if (profileOpt.isPresent()) {

            Profile p = profileOpt.get();

            if (p.getHeight() != null && p.getWeight() != null && p.getHeight() > 0) {

                double heightM = p.getHeight() / 100.0;

                bmi = Math.round((p.getWeight() / (heightM * heightM)) * 10.0) / 10.0;

                bmiCategory = categorizeBmi(bmi);
            }
        }

        return AnalyticsDto.builder()

                .avgSleepHours(avgSleepHours)
                .totalCaloriesBurned(weeklyCaloriesBurned)
                .totalCaloriesConsumed(weeklyCaloriesConsumed)
                .totalWorkoutMinutes(totalWorkoutMinutes)
                .workoutCount(workoutCount)

                .todayCaloriesBurned(todayCaloriesBurned)
                .todayHydrationLiters(todayHydration)
                .hydrationLiters(weeklyHydration)

                .healthScore(healthScore)
                .healthInsight(insight)

                .stepsToday(0)
                .moodStatus("Good")


                .weeklyWorkoutData(weeklyWorkoutData)
                .weeklySleepData(weeklySleepData)
                .monthlyCalorieTrend(monthlyCalorieTrend)

                .bmi(bmi)
                .bmiCategory(bmiCategory)

                .build();
    }

    private int calculateHealthScore(double avgSleep, double hydration, int workoutCount, int calorieBalance) {

        double sleepScore = Math.min(avgSleep / 8.0, 1.0) * 25;
        double hydrationScore = Math.min(hydration / 3.0, 1.0) * 20;
        double workoutScore = Math.min(workoutCount / 4.0, 1.0) * 20;
        double calorieScore = calorieBalance > -300 ? 15 : 5;

        return (int) Math.round(Math.min(
                sleepScore + hydrationScore + workoutScore + calorieScore,
                100
        ));
    }

    private List<Map<String, Object>> buildWeeklyWorkoutData(Long userId, LocalDate start, LocalDate end) {

        List<Map<String, Object>> result = new ArrayList<>();

        List<Workout> workouts =
                Optional.ofNullable(
                        workoutRepository.findByUserIdAndDateBetween(userId, start, end)
                ).orElse(Collections.emptyList());

        for (int i = 0; i < 7; i++) {

            LocalDate day = start.plusDays(i);

            int calories = workouts.stream()
                    .filter(w -> w.getDate() != null && w.getDate().equals(day))
                    .mapToInt(w -> w.getCaloriesBurned() != null ? w.getCaloriesBurned() : 0)
                    .sum();

            Map<String, Object> point = new HashMap<>();
            point.put("day", day.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
            point.put("calories", calories);

            result.add(point);
        }

        return result;
    }

    private List<Map<String, Object>> buildWeeklySleepData(Long userId, LocalDate start, LocalDate end) {

        List<Map<String, Object>> result = new ArrayList<>();

        List<SleepLog> sleepLogs =
                Optional.ofNullable(
                        sleepLogRepository.findByUserIdAndDateBetween(userId, start, end)
                ).orElse(Collections.emptyList());

        for (int i = 0; i < 7; i++) {

            LocalDate day = start.plusDays(i);

            double hours = sleepLogs.stream()
                    .filter(s -> s.getDate() != null && s.getDate().equals(day))
                    .mapToDouble(s -> s.getSleepHours() != null ? s.getSleepHours() : 0.0)
                    .average()
                    .orElse(0.0);

            Map<String, Object> point = new HashMap<>();
            point.put("day", day.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
            point.put("hours", Math.round(hours * 10.0) / 10.0);

            result.add(point);
        }

        return result;
    }

    private List<Map<String, Object>> buildMonthlyCalorieTrend(Long userId, LocalDate start, LocalDate end) {

        List<Map<String, Object>> result = new ArrayList<>();

        Integer calories =
                Optional.ofNullable(
                        nutritionLogRepository.sumCaloriesConsumedByUserIdAndDateBetween(userId, start, end)
                ).orElse(0);

        Map<String, Object> point = new HashMap<>();
        point.put("week", "Last 30 Days");
        point.put("calories", calories);

        result.add(point);

        return result;
    }
    



    private String categorizeBmi(double bmi) {

        if (bmi < 18.5) return "Underweight";
        if (bmi < 25) return "Normal";
        if (bmi < 30) return "Overweight";

        return "Obese";
    }

    private String generateHealthInsight(int healthScore) {

        if (healthScore >= 85)
            return "🔥 Excellent consistency! You're maintaining elite habits.";

        if (healthScore >= 70)
            return "💪 Great progress! A few small improvements can boost you further.";

        if (healthScore >= 50)
            return "⚠ You're on track, but consistency needs improvement.";

        return "🚨 Your health habits need attention. Start with small daily actions.";
    }
}