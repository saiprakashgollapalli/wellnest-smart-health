package com.wellnest.dto;

import lombok.Data;

@Data
public class TrainerProfileDto {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String title;
    private String specialization;
    private Integer experienceYears;
    private String phoneNumber;
    private String bio;
    private String servicesOffered;
    private Boolean isAvailable;
    private String profileImageUrl;
}