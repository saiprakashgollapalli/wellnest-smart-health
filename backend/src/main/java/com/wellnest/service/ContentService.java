package com.wellnest.service;

import com.wellnest.dto.ContentDto.BlogDto;
import com.wellnest.dto.ContentDto.TrainerDto;
import com.wellnest.entity.Blog;
import com.wellnest.entity.Trainer;
import com.wellnest.entity.User;
import com.wellnest.exception.GlobalExceptionHandler.ResourceNotFoundException;
import com.wellnest.repository.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Services for Blog and Trainer modules.
 */
@Service
@RequiredArgsConstructor
public class ContentService {

    private final BlogRepository blogRepository;
    private final TrainerRepository trainerRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    // ─────────────────── BLOG ─────────────────────────────────────────────────

    @Transactional
    public BlogDto createBlog(Long authorId, BlogDto dto) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authorId));

        Blog blog = Blog.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .category(dto.getCategory())
                .thumbnailUrl(dto.getThumbnailUrl())
                .authorName(author.getName())
                .author(author)
                .build();

        return toBlogDto(blogRepository.save(blog));
    }

    @Transactional(readOnly = true)
    public List<BlogDto> getAllBlogs() {
        return blogRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toBlogDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BlogDto getBlogById(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found: " + id));
        return toBlogDto(blog);
    }

    @Transactional(readOnly = true)
    public List<BlogDto> getBlogsByCategory(String category) {
        return blogRepository.findByCategoryIgnoreCaseOrderByCreatedAtDesc(category)
                .stream().map(this::toBlogDto).collect(Collectors.toList());
    }

    @Transactional
    public void deleteBlog(Long id) {
        if (!blogRepository.existsById(id)) {
            throw new ResourceNotFoundException("Blog not found: " + id);
        }
        blogRepository.deleteById(id);
    }

    // ─────────────────── TRAINER ──────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<TrainerDto> getAllTrainers() {
        return trainerRepository.findByIsAvailableTrueOrderByRatingDesc()
                .stream().map(this::toTrainerDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TrainerDto getTrainerById(Long id) {
        Trainer trainer = trainerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found: " + id));
        return toTrainerDto(trainer);
    }

    @Transactional(readOnly = true)
    public List<TrainerDto> getTrainersBySpecialization(String specialization) {
        return trainerRepository.findBySpecializationIgnoreCaseOrderByRatingDesc(specialization)
                .stream().map(this::toTrainerDto).collect(Collectors.toList());
    }

    @Transactional
    public TrainerDto createTrainer(TrainerDto dto) {
        Trainer trainer = modelMapper.map(dto, Trainer.class);
        trainer.setId(null);
        return toTrainerDto(trainerRepository.save(trainer));
    }

    // ─────────────────── Helpers ──────────────────────────────────────────────

    private BlogDto toBlogDto(Blog blog) {
        BlogDto dto = modelMapper.map(blog, BlogDto.class);
        if (blog.getAuthor() != null) dto.setAuthorName(blog.getAuthor().getName());
        return dto;
    }

    private TrainerDto toTrainerDto(Trainer trainer) {
        return modelMapper.map(trainer, TrainerDto.class);
    }
}