package com.kh.backend.common.auth;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (jwtUtil.validateRefreshToken(refreshToken)) {
            String username = jwtUtil.getUsernameFromRefreshToken(refreshToken);
            String role = jwtUtil.getRoleFromRefreshToken(refreshToken);
            String newAccessToken = jwtUtil.generateAccessToken(username, role);
            return ResponseEntity.ok(new AuthResponse(newAccessToken, refreshToken));
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginMember(@RequestBody LoginRequest loginRequest) {
        Member member = authService.authenticateMember(loginRequest.getId(), loginRequest.getPw());
        if (member != null) {
            String accessToken = jwtUtil.generateAccessToken(member.getId(), "ROLE_MEMBER");
            String refreshToken = jwtUtil.generateRefreshToken(member.getId(), "ROLE_MEMBER");
            return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken));
        } else {
            return ResponseEntity.badRequest().body("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
    }

    @PostMapping("/manager/login")
    public ResponseEntity<?> loginManager(@RequestBody LoginRequest loginRequest) {
        Manager manager = authService.authenticateManager(loginRequest.getId(), loginRequest.getPw());
        if (manager != null) {
            String accessToken = jwtUtil.generateAccessToken(manager.getId(), "ROLE_MANAGER");
            String refreshToken = jwtUtil.generateRefreshToken(manager.getId(), "ROLE_MANAGER");
            return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken));
        } else {
            return ResponseEntity.badRequest().body("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
    }

    @PostMapping("/admin/login")
    public ResponseEntity<?> loginAdmin(@RequestBody LoginRequest loginRequest) {
        Admin admin = authService.authenticateAdmin(loginRequest.getId(), loginRequest.getPw());
        if (admin != null) {
            String accessToken = jwtUtil.generateAccessToken(admin.getId(), "ROLE_ADMIN");
            String refreshToken = jwtUtil.generateRefreshToken(admin.getId(), "ROLE_ADMIN");
            return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken));
        } else {
            return ResponseEntity.badRequest().body("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
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

    @GetMapping("/manager/idCheck")
    public ResponseEntity<String> idCheck(@RequestParam("id") String id) {
        if (authService.idCheckManager(id)) {
            return ResponseEntity.ok(null);
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }
}