package com.wellnest.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class TrainerSessionRequest {

    private Long trainerId;
    private Long userId;
    private LocalDate sessionDate;
    private LocalTime sessionTime;

}