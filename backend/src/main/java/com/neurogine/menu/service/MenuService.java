package com.neurogine.menu.service;

import com.neurogine.menu.dto.MenuRequest;
import com.neurogine.menu.model.Menu;
import com.neurogine.menu.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository repository;

    public Menu create(MenuRequest request) {

        Menu menu = Menu.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .build();

        return repository.save(menu);
    }

    public List<Menu> getAll() {
        return repository.findAll();
    }

    public Menu getById(String id) {
        return repository.findById(id)
                .orElseThrow();
    }

    public Menu update(
            String id,
            MenuRequest request) {

        Menu menu = repository.findById(id)
                .orElseThrow();

        menu.setName(request.getName());
        menu.setDescription(request.getDescription());
        menu.setPrice(request.getPrice());
        menu.setCategory(request.getCategory());

        return repository.save(menu);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }

    public List<Menu> search(String name) {
        return repository.findByNameContainingIgnoreCase(
                name
        );
    }
}