package com.wellnest.repository;

import com.wellnest.entity.TrainerSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TrainerSessionRepository extends JpaRepository<TrainerSession, Long> {

    @Query("SELECT DISTINCT ts FROM TrainerSession ts " +
           "LEFT JOIN FETCH ts.trainer " +
           "LEFT JOIN FETCH ts.user " +
           "WHERE ts.trainer.id = :trainerId")
    List<TrainerSession> findByTrainer_Id(@Param("trainerId") Long trainerId);

    @Query("SELECT DISTINCT ts FROM TrainerSession ts " +
           "LEFT JOIN FETCH ts.trainer " +
           "LEFT JOIN FETCH ts.user " +
           "WHERE ts.user.id = :userId")
    List<TrainerSession> findByUser_Id(@Param("userId") Long userId);
}