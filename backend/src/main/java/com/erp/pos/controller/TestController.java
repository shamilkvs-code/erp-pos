package com.erp.pos.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/public")
    public ResponseEntity<?> publicEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Public endpoint is working!");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/secure")
    public ResponseEntity<?> secureEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Secure endpoint is working!");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/hash-password")
    public ResponseEntity<?> hashPassword(@RequestParam String password) {
        String hashedPassword = passwordEncoder.encode(password);
        Map<String, Object> response = new HashMap<>();
        response.put("password", password);
        response.put("hashedPassword", hashedPassword);
        return ResponseEntity.ok(response);
    }
}
