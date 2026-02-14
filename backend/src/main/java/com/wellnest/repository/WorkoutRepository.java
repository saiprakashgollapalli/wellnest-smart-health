package com.wellnest.repository;

import com.wellnest.entity.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/** Workout repository with custom analytics queries. */
@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {

    /* ================= BASIC QUERIES ================= */

    List<Workout> findByUserIdOrderByDateDesc(Long userId);

    List<Workout> findByUserIdAndDateBetween(
            Long userId,
            LocalDate start,
            LocalDate end
    );

    Optional<Workout> findByUserIdAndDate(Long userId, LocalDate date);

    boolean existsByUserIdAndDate(Long userId, LocalDate date);


    /* ================= ANALYTICS QUERIES ================= */

    @Query("""
        SELECT COALESCE(SUM(w.caloriesBurned), 0)
        FROM Workout w
        WHERE w.user.id = :userId
          AND w.date BETWEEN :start AND :end
    """)
    Integer sumCaloriesBurnedByUserIdAndDateBetween(
            @Param("userId") Long userId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );


    @Query("""
        SELECT COALESCE(SUM(w.duration), 0)
        FROM Workout w
        WHERE w.user.id = :userId
          AND w.date BETWEEN :start AND :end
    """)
    Integer sumDurationByUserIdAndDateBetween(
            @Param("userId") Long userId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );


    /* ================= DASHBOARD SUPPORT ================= */

    @Query("""
        SELECT w
        FROM Workout w
        WHERE w.user.id = :userId
          AND w.date = CURRENT_DATE
    """)
    Optional<Workout> findTodayWorkout(@Param("userId") Long userId);
}
