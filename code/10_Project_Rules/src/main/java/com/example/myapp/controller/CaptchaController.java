package com.example.myapp.controller;

import com.example.myapp.service.CaptchaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public final class CaptchaController {

    private final CaptchaService captchaService;

    public CaptchaController(final CaptchaService captchaService) {
        this.captchaService = captchaService;
    }

    /**
     * Generates a captcha.
     *
     * @return map containing captchaId and imageBase64
     */
    @GetMapping("/captcha")
    public ResponseEntity<Map<String, String>> generateCaptcha() {
        return ResponseEntity.ok(captchaService.generateCaptcha());
    }
}

