package com.wellnest.controller;

import com.wellnest.dto.ContentDto.BlogDto;
import com.wellnest.entity.User;
import com.wellnest.repository.UserRepository;
import com.wellnest.service.ContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Admin Controller – ADMIN-only endpoints for blog moderation and user management.
 * NEW: Added for RBAC system
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin-only moderation and management")
public class AdminController {

    private final ContentService contentService;
    private final UserRepository userRepository;

    // ─────────────────── BLOG MODERATION ──────────────────────────────────────

    @GetMapping("/blogs/pending")
    @Operation(summary = "Get all pending blogs for moderation")
    public ResponseEntity<List<BlogDto>> getPendingBlogs() {
        return ResponseEntity.ok(contentService.getPendingBlogs());
    }

    @PutMapping("/blogs/{id}/approve")
    @Operation(summary = "Approve a pending blog")
    public ResponseEntity<BlogDto> approveBlog(@PathVariable Long id) {
        String moderatorName = SecurityUtils.getCurrentUserName();
        return ResponseEntity.ok(contentService.approveBlog(id, moderatorName));
    }

    @PutMapping("/blogs/{id}/reject")
    @Operation(summary = "Reject a pending blog")
    public ResponseEntity<BlogDto> rejectBlog(@PathVariable Long id) {
        String moderatorName = SecurityUtils.getCurrentUserName();
        return ResponseEntity.ok(contentService.rejectBlog(id, moderatorName));
    }

    @DeleteMapping("/blogs/{id}")
    @Operation(summary = "Force delete any blog (ADMIN only)")
    public ResponseEntity<Map<String, String>> deleteBlog(@PathVariable Long id) {
        contentService.adminDeleteBlog(id);
        return ResponseEntity.ok(Map.of("message", "Blog deleted successfully"));
    }

    // ─────────────────── USER MANAGEMENT ──────────────────────────────────────

    @GetMapping("/users")
    @Operation(summary = "Get all users (ADMIN only)")
    public ResponseEntity<List<UserInfoDto>> getAllUsers() {
        List<UserInfoDto> users = userRepository.findAll().stream()
                .map(u -> new UserInfoDto(
                        u.getId(),
                        u.getName(),
                        u.getEmail(),
                        u.getRole().name(),
                        u.getCreatedAt()
                ))
                .toList();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete a user (ADMIN only)")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId.equals(id)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Cannot delete your own account"));
        }
        
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    // ─────────────────── DTO ──────────────────────────────────────────────────

    public record UserInfoDto(
            Long id,
            String name,
            String email,
            String role,
            java.time.LocalDateTime createdAt
    ) {}
}