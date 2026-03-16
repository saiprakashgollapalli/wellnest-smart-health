package com.wellnest.service;

import com.wellnest.entity.Trainer;
import com.wellnest.repository.TrainerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainerServiceImpl implements TrainerService {

    private final TrainerRepository trainerRepository;

    public TrainerServiceImpl(TrainerRepository trainerRepository) {
        this.trainerRepository = trainerRepository;
    }

    @Override
    public List<Trainer> getAllTrainers() {
        return trainerRepository.findAll();
    }

    @Override
    public Trainer getTrainerById(Long id) {
        return trainerRepository.findById(id).orElse(null);
    }

    @Override
    public List<Trainer> getBySpecialization(String specialization) {
        return trainerRepository.findBySpecializationIgnoreCaseOrderByRatingDesc(specialization);
    }
}