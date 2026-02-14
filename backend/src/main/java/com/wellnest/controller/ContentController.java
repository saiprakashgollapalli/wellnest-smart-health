package com.wellnest.controller;


import com.wellnest.dto.AnalyticsDto;
import com.wellnest.dto.ContentDto.BlogDto;
import com.wellnest.dto.ContentDto.TrainerDto;
import com.wellnest.service.AnalyticsService;
import com.wellnest.service.ContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Analytics Controller – dashboard data.
 */
@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Analytics", description = "Health dashboard analytics")
class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get health dashboard analytics for current user")
    public ResponseEntity<AnalyticsDto> getDashboard() {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(analyticsService.getDashboardAnalytics(userId));
    }
}

/**
 * Blog Controller – public reads, admin writes.
 */
@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
@Tag(name = "Blogs", description = "Health blog articles")
class BlogController {

    private final ContentService contentService;

    @GetMapping
    @Operation(summary = "Get all blogs")
    public ResponseEntity<List<BlogDto>> getAll() {
        return ResponseEntity.ok(contentService.getAllBlogs());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get blog by ID")
    public ResponseEntity<BlogDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(contentService.getBlogById(id));
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get blogs by category")
    public ResponseEntity<List<BlogDto>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(contentService.getBlogsByCategory(category));
    }

    @PostMapping
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a blog post (Admin only)")
    public ResponseEntity<BlogDto> create(@Valid @RequestBody BlogDto dto) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(contentService.createBlog(userId, dto));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a blog post (Admin only)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        contentService.deleteBlog(id);
        return ResponseEntity.noContent().build();
    }
}

/**
 * Trainer Controller – publicly accessible trainer listings.
 */
@RestController
@RequestMapping("/api/trainers")
@RequiredArgsConstructor
@Tag(name = "Trainers", description = "Trainer listings and suggestions")
class TrainerController {

    private final ContentService contentService;

    @GetMapping
    @Operation(summary = "Get all available trainers")
    public ResponseEntity<List<TrainerDto>> getAll() {
        return ResponseEntity.ok(contentService.getAllTrainers());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get trainer by ID")
    public ResponseEntity<TrainerDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(contentService.getTrainerById(id));
    }

    @GetMapping("/specialization/{spec}")
    @Operation(summary = "Get trainers by specialization")
    public ResponseEntity<List<TrainerDto>> getBySpecialization(@PathVariable String spec) {
        return ResponseEntity.ok(contentService.getTrainersBySpecialization(spec));
    }

    @PostMapping
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add a trainer (Admin only)")
    public ResponseEntity<TrainerDto> create(@Valid @RequestBody TrainerDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(contentService.createTrainer(dto));
    }
} 