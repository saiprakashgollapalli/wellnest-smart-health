package com.wellnest.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HealthTipService {

    private final ProfileService profileService;

    private final List<String> generalTips = List.of(
            "💧 Stay hydrated. Aim for at least 2-3 liters of water daily.",
            "😴 Maintain 7-8 hours of quality sleep each night.",
            "🥗 Include more fruits and vegetables in your meals.",
            "🚶 Take a 10-minute walk after meals to improve digestion.",
            "🧘 Practice deep breathing or meditation for 5 minutes daily.",
            "🏋 Consistency beats intensity. Small workouts matter!",
            "📵 Avoid screens 30 minutes before bedtime for better sleep."
    );

    public String getSmartTip(Long userId) {

        var profile = profileService.getProfile(userId);

        if (profile.getWeight() != null && profile.getHeight() != null) {

            double heightMeters = profile.getHeight() / 100.0;
            double bmi = profile.getWeight() / (heightMeters * heightMeters);

            if (bmi < 18.5) {
                return "🥗 Your BMI suggests you may be underweight. Consider balanced meals with sufficient calories.";
            }

            if (bmi > 25) {
                return "🏃 Your BMI is slightly high. Regular exercise and portion control can help maintain a healthy weight.";
            }
        }

        int index = LocalDate.now().getDayOfYear() % generalTips.size();
        return generalTips.get(index);
    }
}