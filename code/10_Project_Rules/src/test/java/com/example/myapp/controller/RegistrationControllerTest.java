package com.example.myapp.controller;

import com.example.myapp.dto.UserRegistrationRequest;
import com.example.myapp.dto.UserRegistrationResponse;
import com.example.myapp.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public final class RegistrationControllerTest {

    @Test
    void controllerDelegatesToService() {
        UserService userService = mock(UserService.class);
        RegistrationController controller = new RegistrationController(userService);
        UserRegistrationRequest req = new UserRegistrationRequest();
        req.setUsername("user1234");
        req.setEmail("a@b.com");
        req.setPhone("+1234567890");
        req.setPassword("Abcdefg1");
        req.setConfirmPassword("Abcdefg1");
        req.setCaptchaId("id");
        req.setCaptchaCode("code");
        when(userService.registerUser(any())).thenReturn(new UserRegistrationResponse("1", "ok"));
        ResponseEntity<UserRegistrationResponse> resp = controller.register(req);
        assertEquals(200, resp.getStatusCode().value());
        assertEquals("1", resp.getBody().getUserId());
    }
}

