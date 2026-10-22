package com.neurogine.menu.repository;

import com.neurogine.menu.model.Menu;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MenuRepository
        extends MongoRepository<Menu, String> {

    List<Menu> findByNameContainingIgnoreCase(
            String name);
}