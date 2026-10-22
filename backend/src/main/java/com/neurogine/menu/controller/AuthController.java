package com.neurogine.menu.controller;

import com.neurogine.menu.model.User;
import com.neurogine.menu.repository.UserRepository;
import com.neurogine.menu.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        logger.info("Registration attempt for username: {}", user.getUsername());

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            logger.warn("Registration failed: Username '{}' is already taken.", user.getUsername());
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        logger.info("User registered successfully: {}", savedUser.getUsername());
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        logger.info("Login attempt for username: {}", loginRequest.getUsername());

        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());

        if (userOpt.isPresent() && passwordEncoder.matches(loginRequest.getPassword(), userOpt.get().getPassword())) {
            String token = jwtUtil.generateToken(loginRequest.getUsername());
            logger.info("Login successful for user: {}", loginRequest.getUsername());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("token", token);
            response.put("username", loginRequest.getUsername());
            return ResponseEntity.ok(response);
        }

        logger.warn("Login failed: Invalid credentials for username '{}'", loginRequest.getUsername());
        return ResponseEntity.status(401).body("Error: Invalid username or password!");
    }
}