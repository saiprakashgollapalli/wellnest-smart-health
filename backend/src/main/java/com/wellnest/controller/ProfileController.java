package com.wellnest.controller;

import com.wellnest.dto.ProfileDto;
import com.wellnest.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Profile Controller – create and retrieve fitness profile.
 */
@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Profile", description = "Fitness profile management")
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping
    @Operation(summary = "Create or update fitness profile")
    public ResponseEntity<ProfileDto> saveProfile(@Valid @RequestBody ProfileDto dto) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(profileService.saveProfile(userId, dto));
    }

    @GetMapping
    @Operation(summary = "Get current user's fitness profile")
    public ResponseEntity<ProfileDto> getProfile() {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(profileService.getProfile(userId));
    }
}