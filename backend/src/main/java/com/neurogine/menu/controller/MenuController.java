package com.neurogine.menu.controller;

import com.neurogine.menu.model.Menu;
import com.neurogine.menu.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menus")
public class MenuController {

    @Autowired
    private MenuRepository menuRepository;

    // GET: Retrieve all menu items
    @GetMapping
    public List<Menu> getAllMenus() {
        return menuRepository.findAll();
    }

    // POST: Create a new menu item
    @PostMapping
    public Menu createMenu(@RequestBody Menu menu) {
        return menuRepository.save(menu);
    }

    // PUT: Update an existing menu item
    @PutMapping("/{id}")
    public ResponseEntity<Menu> updateMenu(@PathVariable String id, @RequestBody Menu menuDetails) {
        return menuRepository.findById(id)
                .map(menu -> {
                    menu.setName(menuDetails.getName());
                    menu.setDescription(menuDetails.getDescription());
                    menu.setPrice(menuDetails.getPrice());
                    menu.setCategory(menuDetails.getCategory());
                    Menu updatedMenu = menuRepository.save(menu);
                    return ResponseEntity.ok(updatedMenu);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE: Delete a menu item by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable String id) {
        if (menuRepository.existsById(id)) {
            menuRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}