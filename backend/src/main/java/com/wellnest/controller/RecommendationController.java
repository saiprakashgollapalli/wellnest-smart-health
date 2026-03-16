package com.wellnest.controller;

import com.wellnest.entity.Profile;
import com.wellnest.entity.Trainer;
import com.wellnest.repository.ProfileRepository;
import com.wellnest.repository.TrainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@CrossOrigin(origins="*")
public class RecommendationController {

    private final ProfileRepository profileRepository;
    private final TrainerRepository trainerRepository;

    @GetMapping("/trainers/{userId}")
public List<Trainer> recommendTrainers(@PathVariable Long userId){

    Profile profile = profileRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Profile not found"));

    double height = profile.getHeight();
    double weight = profile.getWeight();

    double bmi = weight / ((height/100) * (height/100));

    if(bmi > 25){
        return trainerRepository.findBySpecializationIgnoreCaseOrderByRatingDesc("Cardio & HIIT");
    }

    if(bmi < 18.5){
        return trainerRepository.findBySpecializationIgnoreCaseOrderByRatingDesc("Strength Training");
    }

    return trainerRepository.findBySpecializationIgnoreCaseOrderByRatingDesc("Yoga & Meditation");
}
}