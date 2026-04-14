package com.wellnest.controller;

import com.wellnest.dto.ContentDto.BlogDto;
import com.wellnest.dto.ContentDto.TrainerDto;
import com.wellnest.repository.TrainerRepository;
import com.wellnest.service.ContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Trainer Controller – Handles trainer listings and blog moderation
 */
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Trainer", description = "Trainer management and blog moderation")
public class TrainerController {

    private final TrainerRepository trainerRepository;
    private final ContentService contentService;

    // ─────────────────── PUBLIC TRAINER ENDPOINTS ───────────────────

    @GetMapping("/api/trainers")
    @Operation(summary = "Get all available trainers")
    public List<TrainerDto> getAllTrainers() {
        return contentService.getAllTrainers();
    }

    @GetMapping("/api/trainers/{id}")
    @Operation(summary = "Get trainer by ID")
    public ResponseEntity<TrainerDto> getTrainerById(@PathVariable Long id) {
        return ResponseEntity.ok(contentService.getTrainerById(id));
    }

    @GetMapping("/api/trainers/specialization/{spec}")
    @Operation(summary = "Get trainers by specialization")
    public List<TrainerDto> getBySpecialization(@PathVariable String spec) {
        return contentService.getTrainersBySpecialization(spec);
    }

    // ─────────────────── TRAINER MODERATION ENDPOINTS ─────────────

    @GetMapping("/api/trainer/blogs/pending")
    @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
    @Operation(summary = "Get all pending blogs for moderation")
    public ResponseEntity<List<BlogDto>> getPendingBlogs() {
        return ResponseEntity.ok(contentService.getPendingBlogs());
    }

    @PutMapping("/api/trainer/blogs/{id}/approve")
    @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
    @Operation(summary = "Approve a pending blog")
    public ResponseEntity<BlogDto> approveBlog(@PathVariable Long id) {
        String moderatorName = SecurityUtils.getCurrentUserName();
        return ResponseEntity.ok(contentService.approveBlog(id, moderatorName));
    }

    @PutMapping("/api/trainer/blogs/{id}/reject")
    @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
    @Operation(summary = "Reject a pending blog")
    public ResponseEntity<BlogDto> rejectBlog(@PathVariable Long id) {
        String moderatorName = SecurityUtils.getCurrentUserName();
        return ResponseEntity.ok(contentService.rejectBlog(id, moderatorName));
    }
}