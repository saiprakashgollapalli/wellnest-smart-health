package com.wellnest.repository;

import com.wellnest.entity.NutritionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

/** NutritionLog repository. */
@Repository
public interface NutritionLogRepository extends JpaRepository<NutritionLog, Long> {

    List<NutritionLog> findByUserIdOrderByDateDesc(Long userId);

    List<NutritionLog> findByUserIdAndDateBetween(Long userId, LocalDate start, LocalDate end);

    @Query("SELECT COALESCE(SUM(n.caloriesConsumed), 0) FROM NutritionLog n " +
           "WHERE n.user.id = :userId AND n.date BETWEEN :start AND :end")
    Integer sumCaloriesConsumedByUserIdAndDateBetween(
        @Param("userId") Long userId,
        @Param("start") LocalDate start,
        @Param("end") LocalDate end
    );
}