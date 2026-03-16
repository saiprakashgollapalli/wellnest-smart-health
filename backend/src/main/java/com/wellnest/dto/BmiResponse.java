package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BmiResponse {

    private double bmi;
    private String category;
    private String interpretation;
}