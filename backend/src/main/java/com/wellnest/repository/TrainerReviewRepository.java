package com.wellnest.repository;

import com.wellnest.entity.TrainerReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainerReviewRepository extends JpaRepository<TrainerReview, Long> {

    List<TrainerReview> findByTrainer_Id(Long trainerId);

}