package com.wellnest.controller;

import com.wellnest.entity.Trainer;
import com.wellnest.repository.TrainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TrainerController {

    private final TrainerRepository trainerRepository;

    @GetMapping
    public List<Trainer> getAllTrainers() {
        return trainerRepository.findAll();
    }

    @GetMapping("/{id}")
    public Trainer getTrainerById(@PathVariable Long id) {
        return trainerRepository.findById(id).orElse(null);
    }

    @GetMapping("/specialization/{spec}")
    public List<Trainer> getBySpecialization(@PathVariable String spec) {
        return trainerRepository.findBySpecializationIgnoreCaseOrderByRatingDesc(spec);
    }
}