package com.neurogine.menu.controller;

import com.neurogine.menu.model.MenuItem;
import com.neurogine.menu.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menus")
@CrossOrigin(origins = "*")
public class MenuController {
    @Autowired
    private MenuItemRepository repository;

    @GetMapping
    public List<MenuItem> getAllMenuItems() {
        return repository.findAll();
    }

    @PostMapping
    public MenuItem createMenuItem(@RequestBody MenuItem item) {
        return repository.save(item);
    }

    @DeleteMapping("/{id}")
    public void deleteMenuItem(@PathVariable String id) {
        repository.deleteById(id);
    }
}