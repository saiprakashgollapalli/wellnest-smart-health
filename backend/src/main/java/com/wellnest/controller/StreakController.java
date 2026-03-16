package com.wellnest.controller;

import com.wellnest.service.StreakService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/streak")
@RequiredArgsConstructor
public class StreakController {

    private final StreakService streakService;

    @GetMapping
    public Integer getCurrentStreak() {

        Long userId = SecurityUtils.getCurrentUserId();

        if (userId == null) {
            return 0;
        }

        return streakService.getCurrentStreak(userId);
    }

    @GetMapping("/weekly")
    public List<Boolean> getWeeklyStreak() {

        Long userId = SecurityUtils.getCurrentUserId();

        if (userId == null) {
            return List.of(false,false,false,false,false,false,false);
        }

        return streakService.getWeeklyStreak(userId);
    }

    @GetMapping("/monthly")
    public List<Boolean> getMonthlyStreak() {

        Long userId = SecurityUtils.getCurrentUserId();

        if (userId == null) {
            return List.of();
        }

        return streakService.getMonthlyStreak(userId);
    }
}