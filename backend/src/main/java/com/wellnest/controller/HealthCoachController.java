package com.wellnest.controller;

import com.wellnest.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai-coach")
@RequiredArgsConstructor
public class HealthCoachController {

    private final GeminiService geminiService;

    @PostMapping("/ask")
    public Map<String,String> askCoach(@RequestBody Map<String,Object> req){

        String question = req.get("question").toString();

        Double bmi = req.get("bmi") != null ? Double.valueOf(req.get("bmi").toString()) : null;
        Double sleep = req.get("sleep") != null ? Double.valueOf(req.get("sleep").toString()) : null;
        Double hydration = req.get("hydration") != null ? Double.valueOf(req.get("hydration").toString()) : null;
        Integer workout = req.get("workout") != null ? Integer.valueOf(req.get("workout").toString()) : null;

        String answer = geminiService.askAI(question,bmi,sleep,hydration,workout);

        return Map.of("answer", answer);
    }
}