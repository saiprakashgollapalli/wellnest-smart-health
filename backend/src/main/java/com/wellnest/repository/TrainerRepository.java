package com.wellnest.repository;

import com.wellnest.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    List<Trainer> findByIsAvailableTrueOrderByRatingDesc();
    List<Trainer> findBySpecializationIgnoreCaseOrderByRatingDesc(String specialization);
    Optional<Trainer> findByUserId(Long userId);  // ADD THIS
}