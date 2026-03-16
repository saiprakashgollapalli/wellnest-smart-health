package com.wellnest.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WaterIntakeDto {

    private Long id;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @DecimalMin(value = "0.1", message = "Liters must be greater than 0")
    private Double liters;

    private Long userId;
}