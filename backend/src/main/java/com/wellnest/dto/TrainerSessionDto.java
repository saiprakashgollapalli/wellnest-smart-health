package com.wellnest.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class TrainerSessionDto {
    private Long id;
    private Long trainerId;
    private String trainerName;
    private Long userId;
    private String userName;
    private LocalDate sessionDate;
    private LocalTime sessionTime;
    private String status;
}