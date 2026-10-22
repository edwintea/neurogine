package com.neurogine.menu.repository;

import com.neurogine.menu.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    // Custom query method to look up a user by their username during login/registration
    Optional<User> findByUsername(String username);
}