package com.wellnest.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * Profile entity – stores fitness profile data linked to a user.
 */
@Entity
@Table(name = "profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(1) @Max(120)
    @Column(nullable = false)
    private Integer age;

    @DecimalMin("50.0") @DecimalMax("300.0")
    @Column(nullable = false)
    private Double height; // in cm

    @DecimalMin("20.0") @DecimalMax("500.0")
    @Column(nullable = false)
    private Double weight; // in kg

    @Enumerated(EnumType.STRING)
    @Column(name = "fitness_goal", nullable = false)
    private FitnessGoal fitnessGoal;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    public enum FitnessGoal {
        WEIGHT_LOSS, MUSCLE_GAIN, GENERAL_HEALTH
    }
}