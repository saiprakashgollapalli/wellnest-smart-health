package com.wellnest.controller;

import com.wellnest.dto.TrainerSessionRequest;
import com.wellnest.entity.Trainer;
import com.wellnest.entity.TrainerSession;
import com.wellnest.entity.User;
import com.wellnest.repository.TrainerRepository;
import com.wellnest.repository.TrainerSessionRepository;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainer-sessions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TrainerSessionController {

    private final TrainerSessionRepository sessionRepository;
    private final TrainerRepository trainerRepository;
    private final UserRepository userRepository;

    // Book a session
    @PostMapping
    public TrainerSession bookSession(@RequestBody TrainerSessionRequest request) {

        Trainer trainer = trainerRepository.findById(request.getTrainerId())
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        TrainerSession session = TrainerSession.builder()
                .trainer(trainer)
                .user(user)
                .sessionDate(request.getSessionDate())
                .sessionTime(request.getSessionTime())
                .status(TrainerSession.Status.BOOKED)
                .build();

        return sessionRepository.save(session);
    }

    // Trainer sessions
    @GetMapping("/trainer/{trainerId}")
    public List<TrainerSession> getTrainerSessions(@PathVariable Long trainerId) {
        return sessionRepository.findByTrainer_Id(trainerId);
    }

    // User sessions
    @GetMapping("/user/{userId}")
    public List<TrainerSession> getUserSessions(@PathVariable Long userId) {
        return sessionRepository.findByUser_Id(userId);
    }
}