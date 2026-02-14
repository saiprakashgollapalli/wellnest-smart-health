package com.wellnest.controller;

import com.wellnest.dto.WorkoutDto;
import com.wellnest.service.WorkoutService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Workout Controller – CRUD for workout logs.
 */
@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Workouts", description = "Workout tracking CRUD")
public class WorkoutController {

    private final WorkoutService workoutService;

    /* ================= CREATE ================= */

    @PostMapping
    @Operation(summary = "Log a new workout")
    public ResponseEntity<WorkoutDto> create(
            @Valid @RequestBody WorkoutDto dto) {

        Long userId = SecurityUtils.getCurrentUserId();

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(workoutService.createWorkout(userId, dto));
    }

    /* ================= READ ================= */

    @GetMapping
    @Operation(summary = "Get all workout logs for current user")
    public ResponseEntity<List<WorkoutDto>> getAll() {

        Long userId = SecurityUtils.getCurrentUserId();

        return ResponseEntity.ok(
                workoutService.getWorkoutsByUser(userId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a specific workout by ID")
    public ResponseEntity<WorkoutDto> getById(@PathVariable Long id) {

        Long userId = SecurityUtils.getCurrentUserId();

        return ResponseEntity.ok(
                workoutService.getWorkoutById(id, userId));
    }

    /** Dashboard quick card */
    @GetMapping("/today")
    @Operation(summary = "Get today's workout")
    public ResponseEntity<WorkoutDto> getTodayWorkout() {

        Long userId = SecurityUtils.getCurrentUserId();

        return ResponseEntity.ok(
                workoutService.getTodayWorkout(userId));
    }

    /** Analytics support */
    @GetMapping("/range")
    @Operation(summary = "Get workouts within a date range")
    public ResponseEntity<List<WorkoutDto>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate start,

            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate end) {

        Long userId = SecurityUtils.getCurrentUserId();

        return ResponseEntity.ok(
                workoutService.getWorkoutsByDateRange(userId, start, end));
    }

    /* ================= UPDATE ================= */

    @PutMapping("/{id}")
    @Operation(summary = "Update a workout log")
    public ResponseEntity<WorkoutDto> update(
            @PathVariable Long id,
            @Valid @RequestBody WorkoutDto dto) {

        Long userId = SecurityUtils.getCurrentUserId();

        return ResponseEntity.ok(
                workoutService.updateWorkout(id, userId, dto));
    }

    /* ================= DELETE ================= */

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a workout log")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        Long userId = SecurityUtils.getCurrentUserId();

        workoutService.deleteWorkout(id, userId);

        return ResponseEntity.noContent().build();
    }
}
