package com.wellnest.controller;

import com.wellnest.dto.TrainerSessionDto;
import com.wellnest.dto.TrainerSessionRequest;
import com.wellnest.dto.ClientDto;
import com.wellnest.entity.Trainer;
import com.wellnest.entity.TrainerSession;
import com.wellnest.entity.User;
import com.wellnest.repository.TrainerRepository;
import com.wellnest.repository.TrainerSessionRepository;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.List;
import java.util.Map;
import java.util.Comparator;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/trainer-sessions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TrainerSessionController {

    private final TrainerSessionRepository sessionRepository;
    private final TrainerRepository trainerRepository;
    private final UserRepository userRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<?> bookSession(@RequestBody TrainerSessionRequest request) {
        try {
            System.out.println("Booking request - trainerId: " + request.getTrainerId() + ", userId: " + request.getUserId());
            
            // Try to find trainer by ID first
            Trainer trainer = trainerRepository.findById(request.getTrainerId())
                .orElse(null);
            
            // If not found, try to find by user_id
            if (trainer == null) {
                trainer = trainerRepository.findByUserId(request.getTrainerId())
                    .orElseThrow(() -> new RuntimeException("Trainer not found for ID: " + request.getTrainerId()));
            }
            
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found: " + request.getUserId()));

            TrainerSession session = TrainerSession.builder()
                    .trainer(trainer)
                    .user(user)
                    .sessionDate(request.getSessionDate())
                    .sessionTime(request.getSessionTime())
                    .status(TrainerSession.Status.BOOKED)
                    .build();

            TrainerSession saved = sessionRepository.save(session);
            System.out.println("Session booked with ID: " + saved.getId());
            
            return ResponseEntity.ok(toDto(saved));
        } catch (Exception e) {
            System.err.println("Error booking session: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error booking session: " + e.getMessage());
        }
    }

    @GetMapping("/trainer/{trainerId}")
    @Transactional(readOnly = true)
    public ResponseEntity<List<TrainerSessionDto>> getTrainerSessions(@PathVariable Long trainerId) {
        try {
            List<TrainerSession> sessions = sessionRepository.findByTrainer_Id(trainerId);
            return ResponseEntity.ok(sessions.stream().map(this::toDto).collect(Collectors.toList()));
        } catch (Exception e) {
            System.err.println("Error getting trainer sessions: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/trainer/{trainerId}/clients")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ClientDto>> getTrainerClients(@PathVariable Long trainerId) {
        try {
            List<TrainerSession> sessions = sessionRepository.findByTrainer_Id(trainerId);
            
            // Group by User ID instead of User entity to avoid recursive hashCode stack overflow
            Map<Long, List<TrainerSession>> sessionsByUser = sessions.stream()
                .collect(Collectors.groupingBy(session -> session.getUser().getId()));
                
            List<ClientDto> clients = sessionsByUser.entrySet().stream().map(entry -> {
                // Get the User from the first session in the list
                User user = entry.getValue().get(0).getUser();
                List<TrainerSession> userSessions = entry.getValue();
                
                // Find most recent session date
                java.time.LocalDate lastSessionDate = userSessions.stream()
                    .map(TrainerSession::getSessionDate)
                    .max(Comparator.naturalOrder())
                    .orElse(null);
                    
                return ClientDto.builder()
                    .userId(user.getId())
                    .userName(user.getName())
                    .totalSessions(userSessions.size())
                    .lastSessionDate(lastSessionDate)
                    .build();
            })
            .sorted((c1, c2) -> {
                if (c1.getLastSessionDate() == null) return 1;
                if (c2.getLastSessionDate() == null) return -1;
                return c2.getLastSessionDate().compareTo(c1.getLastSessionDate());
            })
            .collect(Collectors.toList());
            
            return ResponseEntity.ok(clients);
        } catch (Throwable e) {
            System.err.println("Error getting trainer clients: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}")
    @Transactional(readOnly = true)
    public ResponseEntity<List<TrainerSessionDto>> getUserSessions(@PathVariable Long userId) {
        try {
            List<TrainerSession> sessions = sessionRepository.findByUser_Id(userId);
            return ResponseEntity.ok(sessions.stream().map(this::toDto).collect(Collectors.toList()));
        } catch (Exception e) {
            System.err.println("Error getting user sessions: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/cancel")
    @Transactional
    public ResponseEntity<?> cancelSession(@PathVariable Long id) {
        try {
            TrainerSession session = sessionRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Session not found: " + id));
            
            session.setStatus(TrainerSession.Status.CANCELLED);
            sessionRepository.save(session);
            
            return ResponseEntity.ok("Session cancelled successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/complete")
    @Transactional
    public ResponseEntity<?> completeSession(@PathVariable Long id) {
        try {
            TrainerSession session = sessionRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Session not found: " + id));
            
            session.setStatus(TrainerSession.Status.COMPLETED);
            sessionRepository.save(session);
            
            return ResponseEntity.ok("Session marked as completed");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private TrainerSessionDto toDto(TrainerSession session) {
        TrainerSessionDto dto = new TrainerSessionDto();
        dto.setId(session.getId());
        dto.setTrainerId(session.getTrainer().getId());
        dto.setTrainerName(session.getTrainer().getName());
        dto.setUserId(session.getUser().getId());
        dto.setUserName(session.getUser().getName());
        dto.setSessionDate(session.getSessionDate());
        dto.setSessionTime(session.getSessionTime());
        dto.setStatus(session.getStatus().name());
        return dto;
    }
}