package com.wellnest.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * SleepLog entity – tracks user sleep duration and quality.
 */
@Entity
@Table(name = "sleep_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SleepLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "bed_time")
    private LocalTime bedTime;

    @Column(name = "wake_time")
    private LocalTime wakeTime;

    @DecimalMin("0.0") @DecimalMax("24.0")
    @Column(name = "sleep_hours", nullable = false)
    private Double sleepHours;

    @Enumerated(EnumType.STRING)
    @Column(name = "sleep_quality")
    private SleepQuality sleepQuality;

    @Column(length = 300)
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public enum SleepQuality {
        POOR, FAIR, GOOD, EXCELLENT
    }
}