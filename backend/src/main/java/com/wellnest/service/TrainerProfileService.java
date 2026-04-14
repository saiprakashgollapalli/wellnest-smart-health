package com.wellnest.service;

import com.wellnest.entity.TrainerProfile;
import com.wellnest.entity.User;
import com.wellnest.repository.TrainerProfileRepository;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;  // ← ADD THIS IMPORT
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TrainerProfileService {
    
    private final TrainerProfileRepository profileRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public TrainerProfile createOrUpdateProfile(Long userId, TrainerProfile profileData) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        
        Optional<TrainerProfile> existingOpt = profileRepository.findByUserId(userId);
        
        TrainerProfile profile;
        if (existingOpt.isPresent()) {
            profile = existingOpt.get();
            profile.setTitle(profileData.getTitle());
            profile.setSpecialization(profileData.getSpecialization());
            profile.setExperienceYears(profileData.getExperienceYears());
            profile.setPhoneNumber(profileData.getPhoneNumber());
            profile.setBio(profileData.getBio());
            profile.setServicesOffered(profileData.getServicesOffered());
            profile.setIsAvailable(profileData.getIsAvailable());
            profile.setProfileImageUrl(profileData.getProfileImageUrl());
        } else {
            profileData.setUser(user);
            profile = profileRepository.save(profileData);
        }
        
        return profileRepository.save(profile);
    }
    
    @Transactional(readOnly = true)
    public TrainerProfile getProfileByUserId(Long userId) {
        return profileRepository.findByUserId(userId).orElse(null);
    }
    
    @Transactional(readOnly = true)
    public List<TrainerProfile> getAllTrainerProfiles() {
        return profileRepository.findAllWithUser();
    }
}