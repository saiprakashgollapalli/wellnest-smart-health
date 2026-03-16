package com.wellnest.controller;

import com.wellnest.dto.BmiResponse;
import com.wellnest.service.BmiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bmi")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "BMI", description = "BMI calculation endpoints")
public class BmiController {

    private final BmiService bmiService;

    @GetMapping("/me")
    @Operation(summary = "Get BMI for current user")
    public ResponseEntity<BmiResponse> getMyBmi() {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(bmiService.calculateForUser(userId));
    }
}