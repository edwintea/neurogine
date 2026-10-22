package com.neurogine.menu.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "menus")
public class Menu {

    @Id
    private String id;

    private String name;

    private String description;

    private Double price;

    private String category;
}