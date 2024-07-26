package com.kh.backend.common.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.kh.backend.admin.Admin;
import com.kh.backend.admin.AdminService;
import com.kh.backend.common.jwt.JwtUtil;

@RestController
public class AuthController {

    private final JwtUtil jwtUtil;
    private final AdminService adminService;

    public AuthController(JwtUtil jwtUtil, AdminService adminService) {
        this.jwtUtil = jwtUtil;
        this.adminService = adminService;
    }

    @PostMapping("/api/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            Admin admin = adminService.registerAdmin(registerRequest.getId(), registerRequest.getPw());
            return ResponseEntity.ok(new MessageResponse("Admin registered successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Admin admin = adminService.authenticateAdmin(loginRequest.getId(), loginRequest.getPw());
        if (admin != null) {
            String token = jwtUtil.generateToken(admin.getId());
            return ResponseEntity.ok(new AuthResponse(token));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid username or password"));
        }
    }
}