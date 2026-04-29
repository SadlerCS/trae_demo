package com.example.myapp.controller;

import com.example.myapp.service.CsrfService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public final class CsrfController {

    /**
     * Issues a CSRF token to the client.
     *
     * @return map containing csrfToken
     */
    @GetMapping("/csrf-token")
    public ResponseEntity<Map<String, String>> getCsrfToken() {
        String token = CsrfService.issueToken();
        return ResponseEntity.ok(Map.of("csrfToken", token));
    }
}

