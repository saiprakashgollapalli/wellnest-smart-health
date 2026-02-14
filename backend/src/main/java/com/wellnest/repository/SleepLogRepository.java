package com.wellnest.repository;

import com.wellnest.entity.SleepLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

/** SleepLog repository. */
@Repository
public interface SleepLogRepository extends JpaRepository<SleepLog, Long> {

    List<SleepLog> findByUserIdOrderByDateDesc(Long userId);

    List<SleepLog> findByUserIdAndDateBetween(Long userId, LocalDate start, LocalDate end);

    @Query("SELECT COALESCE(AVG(s.sleepHours), 0) FROM SleepLog s " +
           "WHERE s.user.id = :userId AND s.date BETWEEN :start AND :end")
    Double avgSleepHoursByUserIdAndDateBetween(
        @Param("userId") Long userId,
        @Param("start") LocalDate start,
        @Param("end") LocalDate end
    );
}