package com.wellnest.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Workout entity – logs user workout sessions.
 */
@Entity
@Table(
    name = "workouts",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "date"})
    },
    indexes = {
        @Index(name = "idx_workout_user_date", columnList = "user_id,date")
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "workout_type", nullable = false)
    private WorkoutType workoutType;

    @NotNull
    @Column(nullable = false)
    private LocalDate date;

    @Min(1)
    @Column(nullable = false)
    private Integer duration; // minutes

    @Min(0)
    @Column(name = "calories_burned")
    private Integer caloriesBurned;

    @Column(length = 500)
    private String notes;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.date == null) {
            this.date = LocalDate.now();
        }
    }
}
