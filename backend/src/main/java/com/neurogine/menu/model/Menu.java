package com.neurogine.menu.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "menus")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Menu {
    @Id
    private String id;
    private String name;
    private String description;
    private double price;
    private String category;
}