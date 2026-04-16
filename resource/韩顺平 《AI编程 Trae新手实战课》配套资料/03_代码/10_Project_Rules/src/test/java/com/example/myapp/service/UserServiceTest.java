package com.example.myapp.service;

import com.example.myapp.dto.UserRegistrationRequest;
import com.example.myapp.model.User;
import com.example.myapp.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public final class UserServiceTest {

    private UserRepository userRepository;
    private CaptchaService captchaService;
    private UserService userService;

    @BeforeEach
    void setUp() {
        userRepository = Mockito.mock(UserRepository.class);
        captchaService = Mockito.mock(CaptchaService.class);
        userService = new UserService(userRepository, captchaService);
    }

    @Test
    void passwordsMustMatch() {
        UserRegistrationRequest req = new UserRegistrationRequest();
        req.setUsername("user1234");
        req.setEmail("a@b.com");
        req.setPhone("+1234567890");
        req.setPassword("Abcdefg1");
        req.setConfirmPassword("Abcdefg2");
        req.setCaptchaId("id");
        req.setCaptchaCode("code");
        when(captchaService.validate(anyString(), anyString())).thenReturn(true);
        assertThrows(IllegalArgumentException.class, () -> userService.registerUser(req));
    }

    @Test
    void captchaMustBeValid() {
        UserRegistrationRequest req = baseRequest();
        when(captchaService.validate(anyString(), anyString())).thenReturn(false);
        assertThrows(IllegalArgumentException.class, () -> userService.registerUser(req));
    }

    @Test
    void usernameMustBeUnique() {
        UserRegistrationRequest req = baseRequest();
        when(captchaService.validate(anyString(), anyString())).thenReturn(true);
        when(userRepository.existsByUsername(anyString())).thenReturn(true);
        assertThrows(IllegalArgumentException.class, () -> userService.registerUser(req));
    }

    @Test
    void emailMustBeUnique() {
        UserRegistrationRequest req = baseRequest();
        when(captchaService.validate(anyString(), anyString())).thenReturn(true);
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(true);
        assertThrows(IllegalArgumentException.class, () -> userService.registerUser(req));
    }

    @Test
    void successfulRegistrationReturnsId() {
        UserRegistrationRequest req = baseRequest();
        when(captchaService.validate(anyString(), anyString())).thenReturn(true);
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.save(any())).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(1L);
            return u;
        });
        assertDoesNotThrow(() -> userService.registerUser(req));
    }

    private UserRegistrationRequest baseRequest() {
        UserRegistrationRequest req = new UserRegistrationRequest();
        req.setUsername("user1234");
        req.setEmail("a@b.com");
        req.setPhone("+1234567890");
        req.setPassword("Abcdefg1");
        req.setConfirmPassword("Abcdefg1");
        req.setCaptchaId("id");
        req.setCaptchaCode("code");
        return req;
    }
}

