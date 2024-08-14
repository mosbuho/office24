package com.kh.backend.common.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kh.backend.mapper.AdminMapper;
import com.kh.backend.mapper.ManagerMapper;
import com.kh.backend.mapper.MemberMapper;
import com.kh.backend.model.Admin;
import com.kh.backend.model.Manager;
import com.kh.backend.model.Member;

@Service
public class AuthService {
    private final AdminMapper adminMapper;
    private final MemberMapper memberMapper;
    private final ManagerMapper managerMapper;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AdminMapper adminMapper, MemberMapper memberMapper, ManagerMapper managerMapper,
            PasswordEncoder passwordEncoder) {
        this.adminMapper = adminMapper;
        this.memberMapper = memberMapper;
        this.managerMapper = managerMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public Member authenticateMember(String id, String pw) {
        Member member = memberMapper.findById(id);
        if (member != null && passwordEncoder.matches(pw, member.getPw())) {
            return member;
        }
        return null;
    }

    public Manager authenticateManager(String id, String pw) {
        Manager manager = managerMapper.findById(id);
        if (manager != null && passwordEncoder.matches(pw, manager.getPw())) {
            return manager;
        }
        return null;
    }

    public Admin authenticateAdmin(String id, String pw) {
        Admin admin = adminMapper.findById(id);
        if (admin != null && passwordEncoder.matches(pw, admin.getPw())) {
            return admin;
        }
        return null;
    }
}