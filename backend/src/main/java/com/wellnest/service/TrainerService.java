package com.wellnest.service;

import com.wellnest.entity.Trainer;

import java.util.List;

public interface TrainerService {

    List<Trainer> getAllTrainers();

    Trainer getTrainerById(Long id);

    List<Trainer> getBySpecialization(String specialization);

}