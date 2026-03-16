package com.wellnest.repository;

import com.wellnest.entity.WaterIntake;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WaterIntakeRepository extends JpaRepository<WaterIntake, Long> {

    @Query("SELECT w FROM WaterIntake w WHERE w.user.id = :userId ORDER BY w.date DESC")
    List<WaterIntake> findByUserIdOrderByDateDesc(@Param("userId") Long userId);

    @Query("SELECT w FROM WaterIntake w WHERE w.user.id = :userId AND w.date BETWEEN :start AND :end")
    List<WaterIntake> findByUserIdAndDateBetween(
            @Param("userId") Long userId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

    @Query("SELECT w FROM WaterIntake w WHERE w.user.id = :userId AND w.date = :date")
    List<WaterIntake> findByUserIdAndDate(
            @Param("userId") Long userId,
            @Param("date") LocalDate date
    );

    @Query("SELECT COUNT(w) > 0 FROM WaterIntake w WHERE w.user.id = :userId AND w.date = :date")
    boolean existsByUserIdAndDate(
            @Param("userId") Long userId,
            @Param("date") LocalDate date
    );
}