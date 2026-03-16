package com.wellnest.controller;

import com.wellnest.dto.WaterIntakeDto;
import com.wellnest.service.WaterIntakeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Water Intake Controller – CRUD for hydration tracking.
 */
@RestController
@RequestMapping("/api/water")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Water Intake", description = "Water intake tracking CRUD")
public class WaterIntakeController {

    private final WaterIntakeService waterService;

    /* ================= CREATE ================= */

    @PostMapping
    @Operation(summary = "Log water intake")
    public ResponseEntity<WaterIntakeDto> create(
            @Valid @RequestBody WaterIntakeDto dto) {

        Long userId = SecurityUtils.getCurrentUserId();

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(waterService.createWaterEntry(userId, dto));
    }

    /* ================= READ ================= */

    @GetMapping
    @Operation(summary = "Get all water entries")
    public ResponseEntity<List<WaterIntakeDto>> getAll() {

        Long userId = SecurityUtils.getCurrentUserId();

        return ResponseEntity.ok(
                waterService.getAllByUser(userId));
    }

    @GetMapping("/today")
    @Operation(summary = "Get today's total hydration")
    public ResponseEntity<Double> getTodayTotal() {

        Long userId = SecurityUtils.getCurrentUserId();

        return ResponseEntity.ok(
                waterService.getTodayTotal(userId));
    }

    /* ================= UPDATE ================= */

    @PutMapping("/{id}")
    @Operation(summary = "Update water entry")
    public ResponseEntity<WaterIntakeDto> update(
            @PathVariable Long id,
            @Valid @RequestBody WaterIntakeDto dto) {

        Long userId = SecurityUtils.getCurrentUserId();

        return ResponseEntity.ok(
                waterService.updateEntry(id, userId, dto));
    }

    /* ================= DELETE ================= */

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete water entry")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        Long userId = SecurityUtils.getCurrentUserId();

        waterService.deleteEntry(id, userId);

        return ResponseEntity.noContent().build();
    }
}