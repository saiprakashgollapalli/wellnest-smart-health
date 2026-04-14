package com.wellnest.repository;

import com.wellnest.entity.TrainerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainerProfileRepository extends JpaRepository<TrainerProfile, Long> {
    
    Optional<TrainerProfile> findByUserId(Long userId);
    
    @Query("SELECT tp FROM TrainerProfile tp JOIN FETCH tp.user WHERE tp.user.role = 'TRAINER'")
    List<TrainerProfile> findAllWithUser();
    
    @Query("SELECT tp FROM TrainerProfile tp JOIN FETCH tp.user WHERE tp.user.id = :userId")
    Optional<TrainerProfile> findByUserIdWithUser(@Param("userId") Long userId);
}