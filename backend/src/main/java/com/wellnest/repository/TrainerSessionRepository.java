package com.wellnest.repository;

import com.wellnest.entity.TrainerSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainerSessionRepository extends JpaRepository<TrainerSession, Long> {

    List<TrainerSession> findByTrainer_Id(Long trainerId);

    List<TrainerSession> findByUser_Id(Long userId);
}