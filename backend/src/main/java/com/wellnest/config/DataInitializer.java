package com.wellnest.config;

import com.wellnest.entity.FoodItem;
import com.wellnest.repository.FoodItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final FoodItemRepository foodRepo;

    @PostConstruct
    public void initFoods() {

        if (foodRepo.count() > 0) return;

        foodRepo.save(FoodItem.builder()
                .name("Banana")
                .caloriesPer100g(89.0)
                .proteinPer100g(1.1)
                .carbsPer100g(23.0)
                .fatPer100g(0.3)
                .build());

        foodRepo.save(FoodItem.builder()
                .name("Egg")
                .caloriesPer100g(155.0)
                .proteinPer100g(13.0)
                .carbsPer100g(1.1)
                .fatPer100g(11.0)
                .build());

        foodRepo.save(FoodItem.builder()
                .name("Milk")
                .caloriesPer100g(42.0)
                .proteinPer100g(3.4)
                .carbsPer100g(5.0)
                .fatPer100g(1.0)
                .build());
    }
}