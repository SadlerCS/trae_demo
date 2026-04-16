package com.example.myapp.controller;

import com.example.myapp.dto.UserRegistrationRequest;
import com.example.myapp.dto.UserRegistrationResponse;
import com.example.myapp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public final class RegistrationController {

    private final UserService userService;

    public RegistrationController(final UserService userService) {
        this.userService = userService;
    }

    /**
     * Registers a new user.
     *
     * @param request the registration request DTO
     * @return the registration response DTO
     * @throws IllegalArgumentException if validation fails
     */
    @PostMapping("/register")
    public ResponseEntity<UserRegistrationResponse> register(@Valid @RequestBody final UserRegistrationRequest request) {
        UserRegistrationResponse response = userService.registerUser(request);
        return ResponseEntity.ok(response);
    }
}

