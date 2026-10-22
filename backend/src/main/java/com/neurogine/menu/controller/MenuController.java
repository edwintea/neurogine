package com.neurogine.menu.controller;

import com.neurogine.menu.model.Menu;
import com.neurogine.menu.repository.MenuRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/menus")
public class MenuController {

    private static final Logger logger = LoggerFactory.getLogger(MenuController.class);

    @Autowired
    private MenuRepository menuRepository;

    private final String UPLOAD_DIR = "uploads/";

    @GetMapping
    public List<Menu> getAllMenus() {
        logger.info("Fetching all menu items");
        List<Menu> menus = menuRepository.findAll();
        logger.info("Successfully retrieved {} menu items", menus.size());
        return menus;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Menu> createMenu(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("price") double price,
            @RequestParam("category") String category,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        logger.info("Creating new menu item: name='{}', category='{}', price={}", name, category, price);

        try {
            String imageUrl = null;
            if (file != null && !file.isEmpty()) {
                Files.createDirectories(Paths.get(UPLOAD_DIR));
                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get(UPLOAD_DIR + fileName);
                Files.write(filePath, file.getBytes());
                imageUrl = "http://localhost:8080/uploads/" + fileName;
                logger.info("Image uploaded successfully: {}", fileName);
            }

            Menu menu = Menu.builder()
                    .name(name)
                    .description(description)
                    .price(price)
                    .category(category)
                    .imageUrl(imageUrl)
                    .build();

            Menu savedMenu = menuRepository.save(menu);
            logger.info("Menu item created successfully with ID: {}", savedMenu.getId());
            return ResponseEntity.ok(savedMenu);
        } catch (IOException e) {
            logger.error("Failed to process file upload or save menu item: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Menu> updateMenu(
            @PathVariable String id,
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("price") double price,
            @RequestParam("category") String category,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        logger.info("Updating menu item with ID: {}", id);

        return menuRepository.findById(id).map(menu -> {
            try {
                menu.setName(name);
                menu.setDescription(description);
                menu.setPrice(price);
                menu.setCategory(category);

                if (file != null && !file.isEmpty()) {
                    Files.createDirectories(Paths.get(UPLOAD_DIR));
                    String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                    Path filePath = Paths.get(UPLOAD_DIR + fileName);
                    Files.write(filePath, file.getBytes());
                    menu.setImageUrl("http://localhost:8080/uploads/" + fileName);
                    logger.info("Updated image for menu item ID {}: {}", id, fileName);
                }

                Menu updatedMenu = menuRepository.save(menu);
                logger.info("Menu item updated successfully with ID: {}", id);
                return ResponseEntity.ok(updatedMenu);
            } catch (IOException e) {
                logger.error("Failed to update menu item ID {}: {}", id, e.getMessage(), e);
                return ResponseEntity.internalServerError().<Menu>build();
            }
        }).orElseGet(() -> {
            logger.warn("Update failed: Menu item with ID {} not found", id);
            return ResponseEntity.notFound().build();
        });
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable String id) {
        logger.info("Attempting to delete menu item with ID: {}", id);
        if (menuRepository.existsById(id)) {
            menuRepository.deleteById(id);
            logger.info("Menu item deleted successfully: {}", id);
            return ResponseEntity.ok().build();
        }
        logger.warn("Delete failed: Menu item with ID {} not found", id);
        return ResponseEntity.notFound().build();
    }
}