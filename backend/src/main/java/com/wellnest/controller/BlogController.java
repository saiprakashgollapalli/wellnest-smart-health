package com.wellnest.controller;

import com.wellnest.dto.ContentDto.BlogDto;
import com.wellnest.entity.User;
import com.wellnest.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
public class BlogController {

    private final ContentService contentService;

    @GetMapping
    public ResponseEntity<List<BlogDto>> getAll() {
        return ResponseEntity.ok(contentService.getAllBlogs());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BlogDto> createBlog(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("category") String category,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "imageUrl", required = false) String imageUrl
    ) {
        Long userId = SecurityUtils.getCurrentUserId();
        BlogDto dto = new BlogDto();
        dto.setTitle(title);
        dto.setContent(content);
        dto.setCategory(category);
        dto.setImageUrl(imageUrl);
        BlogDto created = contentService.createBlog(userId, dto, image);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogDto> update(@PathVariable Long id, @RequestBody BlogDto dto) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(contentService.updateBlog(id, userId, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        User.Role userRole = SecurityUtils.getCurrentUserRole();
        contentService.deleteBlog(id, userId, userRole);
        return ResponseEntity.noContent().build();
    }
}