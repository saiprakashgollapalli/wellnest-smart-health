package com.wellnest.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealItemDto {

    private Long foodItemId;
    private Double quantityInGrams;

    private Integer calories;
    private Double protein;
    private Double carbs;
    private Double fat;
}