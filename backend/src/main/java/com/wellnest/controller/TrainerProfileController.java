package com.wellnest.controller;

import com.wellnest.dto.TrainerProfileDto;
import com.wellnest.entity.TrainerProfile;
import com.wellnest.entity.Trainer;
import com.wellnest.entity.User;
import com.wellnest.repository.TrainerProfileRepository;
import com.wellnest.repository.TrainerRepository;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/trainers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Transactional
public class TrainerProfileController {

    private final TrainerProfileRepository trainerProfileRepository;
    private final TrainerRepository trainerRepository;
    private final UserRepository userRepository;

    // DEBUG ENDPOINT - Test if authentication works
    @GetMapping("/debug/me")
    public ResponseEntity<?> debugMe() {
        try {
            Long userId = SecurityUtils.getCurrentUserId();
            User user = userRepository.findById(userId).orElse(null);
            return ResponseEntity.ok("Authenticated! User ID: " + userId + ", Name: " + (user != null ? user.getName() : "unknown"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/profiles")
    public ResponseEntity<?> getAllTrainerProfiles() {
        try {
            List<TrainerProfile> profiles = trainerProfileRepository.findAllWithUser();
            List<TrainerProfileDto> dtos = profiles.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/profile/me")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<?> getMyTrainerProfile() {
        try {
            Long userId = SecurityUtils.getCurrentUserId();
            System.out.println("Getting profile for user ID: " + userId);
            
            TrainerProfile profile = trainerProfileRepository.findByUserIdWithUser(userId).orElse(null);
            
            if (profile == null) {
                System.out.println("No profile found for user: " + userId);
                return ResponseEntity.ok(null);
            }
            
            System.out.println("Profile found: " + profile.getTitle());
            return ResponseEntity.ok(convertToDto(profile));
            
        } catch (Exception e) {
            System.err.println("Error in getMyTrainerProfile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("message", "Error in get: " + e.getMessage()));
        }
    }

    @GetMapping("/profile/user/{userId}")
    public ResponseEntity<?> getTrainerProfileByUserId(@PathVariable Long userId) {
        try {
            TrainerProfile profile = trainerProfileRepository.findByUserIdWithUser(userId).orElse(null);
            if (profile == null) {
                return ResponseEntity.ok(null);
            }
            return ResponseEntity.ok(convertToDto(profile));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/profile")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<?> saveMyTrainerProfile(@RequestBody TrainerProfileDto dto) {
        try {
            Long userId = SecurityUtils.getCurrentUserId();
            System.out.println("Saving profile for user ID: " + userId);
            System.out.println("Profile data received: " + dto);
            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));
            
            TrainerProfile profile = trainerProfileRepository.findByUserIdWithUser(userId).orElse(null);
            
            if (profile == null) {
                profile = new TrainerProfile();
                profile.setUser(user);
            }
            
            // Update fields
            profile.setTitle(dto.getTitle());
            profile.setSpecialization(dto.getSpecialization());
            profile.setExperienceYears(dto.getExperienceYears());
            profile.setPhoneNumber(dto.getPhoneNumber());
            profile.setBio(dto.getBio());
            profile.setServicesOffered(dto.getServicesOffered());
            profile.setIsAvailable(dto.getIsAvailable() != null ? dto.getIsAvailable() : true);
            profile.setProfileImageUrl(dto.getProfileImageUrl());
            
            TrainerProfile saved = trainerProfileRepository.save(profile);
            System.out.println("Profile saved with ID: " + saved.getId());
            
            // Sync with Trainer entity so sessions mapping works seamlessly
            Trainer trainer = trainerRepository.findByUserId(userId).orElse(null);
            if (trainer == null) {
                trainer = new Trainer();
                trainer.setUser(user);
                trainer.setEmail(user.getEmail());
            }
            trainer.setName(user.getName());
            trainer.setSpecialization(dto.getSpecialization());
            trainer.setExperienceYears(dto.getExperienceYears());
            trainer.setPhoneNumber(dto.getPhoneNumber());
            trainer.setBio(dto.getBio());
            trainer.setProfileImageUrl(dto.getProfileImageUrl());
            trainer.setIsAvailable(dto.getIsAvailable() != null ? dto.getIsAvailable() : true);
            if (trainer.getRating() == null) trainer.setRating(5.0); // Default rating
            
            trainerRepository.save(trainer);
            
            return ResponseEntity.ok(convertToDto(saved));
            
        } catch (Exception e) {
            System.err.println("Error in saveMyTrainerProfile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("message", "Error in save: " + e.getMessage()));
        }
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<?> updateMyTrainerProfile(@RequestBody TrainerProfileDto dto) {
        return saveMyTrainerProfile(dto);
    }
    
    @PutMapping("/trainer-profile/{id}")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<?> updateTrainerProfileById(@PathVariable Long id, @RequestBody TrainerProfileDto dto) {
        // ID is ignored since it updates the currently authenticated user's profile
        return saveMyTrainerProfile(dto);
    }

    private TrainerProfileDto convertToDto(TrainerProfile profile) {
        if (profile == null) return null;
        
        TrainerProfileDto dto = new TrainerProfileDto();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUser().getId());
        dto.setName(profile.getUser().getName());
        dto.setEmail(profile.getUser().getEmail());
        dto.setTitle(profile.getTitle());
        dto.setSpecialization(profile.getSpecialization());
        dto.setExperienceYears(profile.getExperienceYears());
        dto.setPhoneNumber(profile.getPhoneNumber());
        dto.setBio(profile.getBio());
        dto.setServicesOffered(profile.getServicesOffered());
        dto.setIsAvailable(profile.getIsAvailable());
        dto.setProfileImageUrl(profile.getProfileImageUrl());
        return dto;
    }
}