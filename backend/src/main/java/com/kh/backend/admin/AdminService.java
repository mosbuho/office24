package com.kh.backend.admin;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    private final AdminMapper adminMapper;
    private final PasswordEncoder passwordEncoder;

    public AdminService(AdminMapper adminMapper, PasswordEncoder passwordEncoder) {
        this.adminMapper = adminMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public Admin registerAdmin(String id, String pw) {
        if (adminMapper.findById(id) != null) {
            throw new RuntimeException("Username already exists");
        }
        Admin admin = new Admin();
        admin.setId(id);
        admin.setPw(passwordEncoder.encode(pw));
        adminMapper.insertAdmin(admin);
        return admin;
    }

    public Admin authenticateAdmin(String id, String pw) {
        Admin admin = adminMapper.findById(id);
        if (admin != null && passwordEncoder.matches(pw, admin.getPw())) {
            return admin;
        }
        return null;
    }
}