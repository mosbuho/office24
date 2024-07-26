package com.kh.backend.common.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.backend.admin.Admin;
import com.kh.backend.common.jwt.JwtUtil;
import com.kh.backend.manager.Manager;
import com.kh.backend.member.Member;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final AuthService authService;

    public AuthController(JwtUtil jwtUtil, AuthService authService) {
        this.jwtUtil = jwtUtil;
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerMember(@RequestBody RegisterRequest registerRequest) {
        try {
            authService.registerMember(registerRequest.getId(), registerRequest.getPw(),
                    registerRequest.getName(), registerRequest.getPhone(), registerRequest.getEmail(),
                    registerRequest.getBirth(), registerRequest.getGender());
            return ResponseEntity.ok(null);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginMember(@RequestBody LoginRequest loginRequest) {
        Member member = authService.authenticateMember(loginRequest.getId(), loginRequest.getPw());
        if (member != null) {
            String accessToken = jwtUtil.generateAccessToken(member.getId());
            String refreshToken = jwtUtil.generateRefreshToken(member.getId());
            return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken));
        } else {
            return ResponseEntity.badRequest().body("Invalid username or password");
        }
    }

    @PostMapping("/manager/register")
    public ResponseEntity<?> registerManager(@RequestBody RegisterRequest registerRequest) {
        try {
            authService.registerManager(registerRequest.getId(), registerRequest.getPw(),
                    registerRequest.getName(), registerRequest.getPhone(), registerRequest.getEmail());
            return ResponseEntity.ok(null);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/manager/login")
    public ResponseEntity<?> loginManager(@RequestBody LoginRequest loginRequest) {
        Manager manager = authService.authenticateManager(loginRequest.getId(), loginRequest.getPw());
        if (manager != null) {
            String accessToken = jwtUtil.generateAccessToken(manager.getId());
            String refreshToken = jwtUtil.generateRefreshToken(manager.getId());
            return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken));
        } else {
            return ResponseEntity.badRequest().body("Invalid username or password");
        }
    }

    @PostMapping("/admin/login")
    public ResponseEntity<?> loginAdmin(@RequestBody LoginRequest loginRequest) {
        Admin admin = authService.authenticateAdmin(loginRequest.getId(), loginRequest.getPw());
        if (admin != null) {
            String accessToken = jwtUtil.generateAccessToken(admin.getId());
            String refreshToken = jwtUtil.generateRefreshToken(admin.getId());
            return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken));
        } else {
            return ResponseEntity.badRequest().body("Invalid username or password");
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshRequest refreshRequest) {
        if (jwtUtil.validateRefreshToken(refreshRequest.getRefreshToken())) {
            String username = jwtUtil.getUsernameFromRefreshToken(refreshRequest.getRefreshToken());
            String newAccessToken = jwtUtil.generateAccessToken(username);
            return ResponseEntity.ok(new AuthResponse(newAccessToken, refreshRequest.getRefreshToken()));
        } else {
            return ResponseEntity.badRequest().body("Invalid refresh token");
        }
    }
}