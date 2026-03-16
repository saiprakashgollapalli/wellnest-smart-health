package com.wellnest.dto;

import lombok.Data;

@Data
public class TrainerReviewRequest {

    private int rating;

    private String comment;

}