package com.wellnest.service;

import com.wellnest.dto.ProfileDto;
import com.wellnest.entity.Profile;
import com.wellnest.entity.User;
import com.wellnest.exception.GlobalExceptionHandler.ResourceNotFoundException;
import com.wellnest.repository.ProfileRepository;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for user fitness profile management.
 */
@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    /** Create or update a user's profile. */
    @Transactional
    public ProfileDto saveProfile(Long userId, ProfileDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Profile profile = profileRepository.findByUserId(userId)
                .orElse(new Profile());

        profile.setAge(dto.getAge());
        profile.setHeight(dto.getHeight());
        profile.setWeight(dto.getWeight());
        profile.setFitnessGoal(dto.getFitnessGoal());
        profile.setProfilePictureUrl(dto.getProfilePictureUrl());
        profile.setUser(user);

        Profile saved = profileRepository.save(profile);
        return toDto(saved);
    }

    /** Get a user's profile. */
    @Transactional(readOnly = true)
    public ProfileDto getProfile(Long userId) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Profile not found for user: " + userId));
        return toDto(profile);
    }

    /** Convert Profile entity to DTO with computed BMI. */
    private ProfileDto toDto(Profile profile) {
        ProfileDto dto = modelMapper.map(profile, ProfileDto.class);
        // BMI = weight(kg) / (height(m))^2
        double heightM = profile.getHeight() / 100.0;
        double bmi = profile.getWeight() / (heightM * heightM);
        dto.setBmi(Math.round(bmi * 10.0) / 10.0);
        return dto;
    }
}