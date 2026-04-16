package com.example.myapp.service;

import com.example.myapp.dto.UserRegistrationRequest;
import com.example.myapp.dto.UserRegistrationResponse;
import com.example.myapp.model.User;
import com.example.myapp.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Objects;

@Service
public final class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final CaptchaService captchaService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(final UserRepository userRepository, final CaptchaService captchaService) {
        this.userRepository = userRepository;
        this.captchaService = captchaService;
    }

    /**
     * Registers a user with validation and secure password hashing.
     *
     * @param request registration request DTO
     * @return registration response DTO
     * @throws IllegalArgumentException if validation fails
     */
    @Transactional
    public UserRegistrationResponse registerUser(final UserRegistrationRequest request) {
        if (!Objects.equals(request.getPassword(), request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }
        if (!captchaService.validate(request.getCaptchaId(), request.getCaptchaCode())) {
            throw new IllegalArgumentException("Invalid captcha");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        String hash = passwordEncoder.encode(request.getPassword());
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(hash);
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setCreatedAt(Instant.now());
        userRepository.save(user);
        log.info("User registered: username={}", request.getUsername());
        return new UserRegistrationResponse(String.valueOf(user.getId()), "Registration successful");
    }
}

