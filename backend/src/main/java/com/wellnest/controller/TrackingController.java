package com.wellnest.controller;

import com.wellnest.dto.TrackingDto.NutritionLogDto;
import com.wellnest.dto.TrackingDto.SleepLogDto;
import com.wellnest.service.TrackingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Tracking Controller – Nutrition and Sleep log CRUD.
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Tracking", description = "Nutrition and Sleep tracking CRUD")
public class TrackingController {

    private final TrackingService trackingService;

    // ─────────────────── NUTRITION ────────────────────────────────────────────

    @PostMapping("/nutrition")
    @Operation(summary = "Log a nutrition entry")
    public ResponseEntity<NutritionLogDto> createNutrition(
            @Valid @RequestBody NutritionLogDto dto) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(trackingService.createNutritionLog(userId, dto));
    }

    @GetMapping("/nutrition")
    @Operation(summary = "Get all nutrition logs")
    public ResponseEntity<List<NutritionLogDto>> getNutrition() {
        return ResponseEntity.ok(trackingService.getNutritionLogsByUser(
                SecurityUtils.getCurrentUserId()));
    }

    @PutMapping("/nutrition/{id}")
    @Operation(summary = "Update a nutrition log")
    public ResponseEntity<NutritionLogDto> updateNutrition(
            @PathVariable Long id, @Valid @RequestBody NutritionLogDto dto) {
        return ResponseEntity.ok(trackingService.updateNutritionLog(
                id, SecurityUtils.getCurrentUserId(), dto));
    }

    @DeleteMapping("/nutrition/{id}")
    @Operation(summary = "Delete a nutrition log")
    public ResponseEntity<Void> deleteNutrition(@PathVariable Long id) {
        trackingService.deleteNutritionLog(id, SecurityUtils.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }

    // ─────────────────── SLEEP ────────────────────────────────────────────────

    @PostMapping("/sleep")
    @Operation(summary = "Log a sleep entry")
    public ResponseEntity<SleepLogDto> createSleep(@Valid @RequestBody SleepLogDto dto) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(trackingService.createSleepLog(userId, dto));
    }

    @GetMapping("/sleep")
    @Operation(summary = "Get all sleep logs")
    public ResponseEntity<List<SleepLogDto>> getSleep() {
        return ResponseEntity.ok(trackingService.getSleepLogsByUser(
                SecurityUtils.getCurrentUserId()));
    }

    @PutMapping("/sleep/{id}")
    @Operation(summary = "Update a sleep log")
    public ResponseEntity<SleepLogDto> updateSleep(
            @PathVariable Long id, @Valid @RequestBody SleepLogDto dto) {
        return ResponseEntity.ok(trackingService.updateSleepLog(
                id, SecurityUtils.getCurrentUserId(), dto));
    }

    @DeleteMapping("/sleep/{id}")
    @Operation(summary = "Delete a sleep log")
    public ResponseEntity<Void> deleteSleep(@PathVariable Long id) {
        trackingService.deleteSleepLog(id, SecurityUtils.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}