package com.wellnest.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    public String askAI(String question, Double bmi, Double sleep, Double hydration, Integer workout) {

        try {

            RestTemplate restTemplate = new RestTemplate();
            String endpoint = GEMINI_URL + apiKey;

            String prompt = """
You are a professional AI Health Coach.

User Health Data:
BMI: %s
Average Sleep: %s hours
Hydration: %s liters
Workout Minutes Per Week: %s

User Question:
%s

Provide concise health advice using bullet points under 150 words.
""".formatted(
                    bmi != null ? bmi : "unknown",
                    sleep != null ? sleep : "unknown",
                    hydration != null ? hydration : "unknown",
                    workout != null ? workout : "unknown",
                    question
            );

            Map<String, Object> textPart = Map.of("text", prompt);

            Map<String, Object> part = Map.of(
                    "parts", List.of(textPart)
            );

            Map<String, Object> body = Map.of(
                    "contents", List.of(part)
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(body, headers);

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(endpoint, request, Map.class);

            Map responseBody = response.getBody();

            if (responseBody == null) {
                return "AI returned empty response.";
            }

            List candidates = (List) responseBody.get("candidates");

            if (candidates == null || candidates.isEmpty()) {
                return "AI could not generate a response.";
            }

            Map candidate = (Map) candidates.get(0);
            Map content = (Map) candidate.get("content");

            List parts = (List) content.get("parts");

            Map text = (Map) parts.get(0);

            return text.get("text").toString();

        } catch (Exception e) {

            e.printStackTrace();
            return "Gemini AI error: " + e.getMessage();

        }
    }
}