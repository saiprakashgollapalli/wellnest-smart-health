package com.wellnest.controller;

import com.wellnest.dto.AnalyticsDto;
import com.wellnest.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Analytics", description = "Health dashboard analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get dashboard analytics")
    public ResponseEntity<AnalyticsDto> getDashboard() {

        Long userId = SecurityUtils.getCurrentUserId();

        return ResponseEntity.ok(
                analyticsService.getDashboardAnalytics(userId)
        );
    }
}