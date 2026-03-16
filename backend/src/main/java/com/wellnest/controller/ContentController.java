package com.wellnest.controller;

import com.wellnest.dto.ContentDto.BlogDto;
import com.wellnest.dto.ContentDto.TrainerDto;
import com.wellnest.service.ContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Content Controller – handles content related operations.
 */
@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
@Tag(name = "Content", description = "Content management APIs")
public class ContentController {

    private final ContentService contentService;

    // BLOG ENDPOINTS

    @GetMapping("/blogs")
    @Operation(summary = "Get all blogs")
    public ResponseEntity<List<BlogDto>> getAllBlogs() {
        return ResponseEntity.ok(contentService.getAllBlogs());
    }

    @GetMapping("/blogs/{id}")
    @Operation(summary = "Get blog by ID")
    public ResponseEntity<BlogDto> getBlogById(@PathVariable Long id) {
        return ResponseEntity.ok(contentService.getBlogById(id));
    }

    // TRAINER ENDPOINTS

    @GetMapping("/trainers")
    @Operation(summary = "Get all trainers")
    public ResponseEntity<List<TrainerDto>> getAllTrainers() {
        return ResponseEntity.ok(contentService.getAllTrainers());
    }

    @GetMapping("/trainers/{id}")
    @Operation(summary = "Get trainer by ID")
    public ResponseEntity<TrainerDto> getTrainerById(@PathVariable Long id) {
        return ResponseEntity.ok(contentService.getTrainerById(id));
    }

    @PostMapping("/trainers")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create trainer (Admin only)")
    public ResponseEntity<TrainerDto> createTrainer(@Valid @RequestBody TrainerDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(contentService.createTrainer(dto));
    }
}