package com.neurogine.menu.dto;

import lombok.Data;

@Data
public class MenuRequest {

    private String name;

    private String description;

    private Double price;

    private String category;
}