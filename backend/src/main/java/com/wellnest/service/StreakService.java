package com.wellnest.service;

import com.wellnest.entity.Workout;
import com.wellnest.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StreakService {

    private final WorkoutRepository workoutRepository;


    // 🔥 Current streak calculation (works even if today's workout not logged yet)
    public int getCurrentStreak(Long userId) {

    List<Workout> workouts = workoutRepository.findByUserIdOrderByDateDesc(userId);

    if (workouts.isEmpty()) {
        return 0;
    }

    int streak = 1;

    LocalDate prevDate = workouts.get(0).getDate();

    for (int i = 1; i < workouts.size(); i++) {

        LocalDate currentDate = workouts.get(i).getDate();

        if (prevDate.minusDays(1).equals(currentDate)) {
            streak++;
            prevDate = currentDate;
        } else {
            break;
        }
    }

    return streak;
}


    // 📅 Weekly streak (Monday → Sunday)
    public List<Boolean> getWeeklyStreak(Long userId) {

        LocalDate weekStart = LocalDate.now().with(DayOfWeek.MONDAY);

        List<Boolean> weekly = new ArrayList<>();

        for (int i = 0; i < 7; i++) {

            LocalDate day = weekStart.plusDays(i);

            boolean workedOut =
                    workoutRepository.existsByUserIdAndDate(userId, day);

            weekly.add(workedOut);
        }

        return weekly;
    }


    // 📊 Monthly streak (1st day → today only)
    public List<Boolean> getMonthlyStreak(Long userId) {

        LocalDate today = LocalDate.now();
        LocalDate start = today.withDayOfMonth(1);

        List<Boolean> monthly = new ArrayList<>();

        LocalDate date = start;

        while (!date.isAfter(today)) {

            boolean workedOut =
                    workoutRepository.existsByUserIdAndDate(userId, date);

            monthly.add(workedOut);

            date = date.plusDays(1);
        }

        return monthly;
    }
}