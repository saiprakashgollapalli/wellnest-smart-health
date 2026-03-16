package com.wellnest.controller;

import com.wellnest.service.HealthTipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tips")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Health Tips", description = "Daily wellness tips")
public class HealthTipController {

    private final HealthTipService healthTipService;

    @GetMapping("/daily")
    @Operation(summary = "Get today's health tip")
    public ResponseEntity<String> getDailyTip() {

    Long userId = SecurityUtils.getCurrentUserId();

    return ResponseEntity.ok(
            healthTipService.getSmartTip(userId)
    );
}
}