package com.wellnest.service;

import com.wellnest.dto.BmiResponse;
import com.wellnest.dto.ProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BmiService {

    private final ProfileService profileService;

    public BmiResponse calculateForUser(Long userId) {

        ProfileDto profile = profileService.getProfile(userId);

        if (profile.getHeight() == null || profile.getWeight() == null) {
            throw new IllegalStateException("Height and weight must be set to calculate BMI");
        }

        double heightMeters = profile.getHeight() / 100.0;
        double bmi = profile.getWeight() / (heightMeters * heightMeters);

        String category;
        String interpretation;

        if (bmi < 18.5) {
            category = "Underweight";
            interpretation = "You may need to increase your calorie intake.";
        } else if (bmi < 25) {
            category = "Normal";
            interpretation = "Great! Maintain your healthy lifestyle.";
        } else if (bmi < 30) {
            category = "Overweight";
            interpretation = "Consider regular exercise and balanced nutrition.";
        } else {
            category = "Obese";
            interpretation = "Consult a healthcare professional for guidance.";
        }

        return new BmiResponse(
                Math.round(bmi * 10.0) / 10.0, // round to 1 decimal
                category,
                interpretation
        );
    }
}