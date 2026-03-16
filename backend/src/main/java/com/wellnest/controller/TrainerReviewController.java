package com.wellnest.controller;

import com.wellnest.dto.TrainerReviewRequest;
import com.wellnest.entity.Trainer;
import com.wellnest.entity.TrainerReview;
import com.wellnest.entity.User;
import com.wellnest.repository.TrainerRepository;
import com.wellnest.repository.TrainerReviewRepository;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainer-reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TrainerReviewController {

    private final TrainerReviewRepository reviewRepository;
    private final TrainerRepository trainerRepository;
    private final UserRepository userRepository;

    @GetMapping("/{trainerId}")
    public List<TrainerReview> getReviews(@PathVariable Long trainerId) {
        return reviewRepository.findByTrainer_Id(trainerId);
    }

    @PostMapping
    public TrainerReview addReview(
            @RequestParam Long trainerId,
            @RequestParam Long userId,
            @RequestBody TrainerReviewRequest request
    ) {

        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TrainerReview review = TrainerReview.builder()
                .trainer(trainer)
                .user(user)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        return reviewRepository.save(review);
    }
}