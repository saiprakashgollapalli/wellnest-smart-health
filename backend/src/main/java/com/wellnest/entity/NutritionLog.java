package com.wellnest.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

/**
 * NutritionLog entity – tracks user meal intake.
 */
@Entity
@Table(name = "nutrition_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NutritionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "meal_type", nullable = false)
    private String mealType;
    @Column(name = "quantity_in_grams", nullable = false)
    private Double quantityInGrams = 0.0;

    @NotBlank
    @Column(name = "food_items", nullable = false, length = 500)
    private String foodItems;

    @Min(0)
    @Column(name = "calories_consumed")
    private Integer caloriesConsumed;

    @Min(0)
    @Column(name = "protein_g")
    private Double proteinGrams;

    @Min(0)
    @Column(name = "carbs_g")
    private Double carbsGrams;

    @Min(0)
    @Column(name = "fat_g")
    private Double fatGrams;

    @NotNull
    @Column(nullable = false)
    private LocalDate date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @PrePersist
public void prePersist() {
    if (this.date == null) {
        this.date = LocalDate.now();
    }
}
}