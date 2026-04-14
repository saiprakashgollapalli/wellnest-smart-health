package com.wellnest.service;

import com.wellnest.dto.ContentDto.BlogDto;
import com.wellnest.dto.ContentDto.TrainerDto;
import com.wellnest.entity.Blog;
import com.wellnest.entity.Trainer;
import com.wellnest.entity.User;
import com.wellnest.entity.BlogStatus;
import com.wellnest.exception.GlobalExceptionHandler.ResourceNotFoundException;
import com.wellnest.repository.BlogRepository;
import com.wellnest.repository.TrainerRepository;
import com.wellnest.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;
import java.util.UUID;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ContentService {

    private final BlogRepository blogRepository;
    private final TrainerRepository trainerRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public BlogDto createBlog(Long userId, BlogDto dto, MultipartFile file) {

        User author = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        BlogStatus status;
        switch (author.getRole()) {
            case ADMIN:
            case TRAINER:
                status = BlogStatus.APPROVED;
                break;
            case USER:
            default:
                status = BlogStatus.PENDING;
                break;
        }

        String imageUrl = null;

        try {
            if (file != null && !file.isEmpty()) {
                String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path uploadDir = Paths.get("uploads/blogs");
                Files.createDirectories(uploadDir);
                Path filePath = uploadDir.resolve(filename);
                Files.write(filePath, file.getBytes());
                imageUrl = "/uploads/blogs/" + filename;
            }
            else if (dto.getImageUrl() != null && !dto.getImageUrl().isBlank()) {
                imageUrl = dto.getImageUrl();
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to store image", e);
        }

        Blog blog = Blog.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .category(dto.getCategory())
                .imageUrl(imageUrl)
                .authorName(author.getName())
                .authorId(author.getId())
                .author(author)
                .status(status)
                .likesCount(0)
                .build();

        Blog savedBlog = blogRepository.save(blog);
        return toBlogDto(savedBlog);
    }

    @Transactional
    public BlogDto updateBlog(Long blogId, Long userId, BlogDto dto) {

        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found: " + blogId));

        if (!blog.getAuthorId().equals(userId)) {
            throw new RuntimeException("You don't have permission to update this blog");
        }

        blog.setTitle(dto.getTitle());
        blog.setContent(dto.getContent());
        blog.setCategory(dto.getCategory());

        if (dto.getImageUrl() != null) {
            blog.setImageUrl(dto.getImageUrl());
        }
        
        blog.setUpdatedAt(LocalDateTime.now());

        Blog updatedBlog = blogRepository.save(blog);
        return toBlogDto(updatedBlog);
    }

    @Transactional
    public void deleteBlog(Long blogId, Long userId, User.Role userRole) {

        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found: " + blogId));

        boolean isAuthor = blog.getAuthorId() != null && blog.getAuthorId().equals(userId);
        boolean isAdmin = userRole == User.Role.ADMIN;

        if (!isAuthor && !isAdmin) {
            throw new RuntimeException("You don't have permission to delete this blog");
        }

        blogRepository.delete(blog);
    }

    @Transactional(readOnly = true)
    public List<BlogDto> getAllBlogs() {
        return blogRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toBlogDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public BlogDto getBlogById(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found: " + id));
        return toBlogDto(blog);
    }

    @Transactional(readOnly = true)
    public List<BlogDto> getPendingBlogs() {
        return blogRepository.findByStatusOrderByCreatedAtDesc(BlogStatus.PENDING)
                .stream()
                .map(this::toBlogDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public BlogDto approveBlog(Long blogId, String moderatorName) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found: " + blogId));
        
        blog.setStatus(BlogStatus.APPROVED);
        blog.setModeratedAt(LocalDateTime.now());
        blog.setModeratedBy(moderatorName);
        
        return toBlogDto(blogRepository.save(blog));
    }

    @Transactional
    public BlogDto rejectBlog(Long blogId, String moderatorName) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found: " + blogId));
        
        blog.setStatus(BlogStatus.REJECTED);
        blog.setModeratedAt(LocalDateTime.now());
        blog.setModeratedBy(moderatorName);
        
        return toBlogDto(blogRepository.save(blog));
    }

    @Transactional
    public void adminDeleteBlog(Long blogId) {
        if (!blogRepository.existsById(blogId)) {
            throw new ResourceNotFoundException("Blog not found: " + blogId);
        }
        blogRepository.deleteById(blogId);
    }

    @Transactional(readOnly = true)
    public List<TrainerDto> getAllTrainers() {
        return trainerRepository.findByIsAvailableTrueOrderByRatingDesc()
                .stream()
                .map(this::toTrainerDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TrainerDto getTrainerById(Long id) {
        Trainer trainer = trainerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found: " + id));
        return toTrainerDto(trainer);
    }

    @Transactional(readOnly = true)
    public List<TrainerDto> getTrainersBySpecialization(String specialization) {
        return trainerRepository
                .findBySpecializationIgnoreCaseOrderByRatingDesc(specialization)
                .stream()
                .map(this::toTrainerDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TrainerDto createTrainer(TrainerDto dto) {
        Trainer trainer = modelMapper.map(dto, Trainer.class);
        trainer.setId(null);
        Trainer savedTrainer = trainerRepository.save(trainer);
        return toTrainerDto(savedTrainer);
    }

    private BlogDto toBlogDto(Blog blog) {
        BlogDto dto = new BlogDto();
        dto.setId(blog.getId());
        dto.setTitle(blog.getTitle());
        dto.setContent(blog.getContent());
        dto.setCategory(blog.getCategory());
        dto.setCreatedAt(blog.getCreatedAt());
        dto.setImageUrl(blog.getImageUrl());
        dto.setThumbnailUrl(blog.getThumbnailUrl());
        dto.setLikesCount(blog.getLikesCount());
        dto.setStatus(blog.getStatus());
        dto.setAuthorName(blog.getAuthorName());
        dto.setAuthorId(blog.getAuthorId());
        dto.setModeratedAt(blog.getModeratedAt());
        dto.setModeratedBy(blog.getModeratedBy());
        return dto;
    }

    private TrainerDto toTrainerDto(Trainer trainer) {
        return modelMapper.map(trainer, TrainerDto.class);
    }
}