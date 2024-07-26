package com.kh.backend.common.auth;

import java.util.Date;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.backend.admin.Admin;
import com.kh.backend.admin.AdminMapper;
import com.kh.backend.manager.Manager;
import com.kh.backend.manager.ManagerMapper;
import com.kh.backend.member.Member;
import com.kh.backend.member.MemberMapper;

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

    public Admin authenticateAdmin(String id, String pw) {
        Admin admin = adminMapper.findById(id);
        if (admin != null && passwordEncoder.matches(pw, admin.getPw())) {
            return admin;
        }
        return null;
    }

    @Transactional
    public void registerMember(String id, String pw, String name, String phone, String email, Date birth,
            String gender) {
        if (memberMapper.findById(id) != null) {
            throw new RuntimeException("Username already exists");
        }
        Member member = new Member();
        member.setId(id);
        member.setPw(passwordEncoder.encode(pw));
        member.setName(name);
        member.setPhone(phone);
        member.setEmail(email);
        member.setBirth(birth);
        member.setGender(gender);
        memberMapper.insertMember(member);
    }

    public Member authenticateMember(String id, String pw) {
        Member member = memberMapper.findById(id);
        if (member != null && passwordEncoder.matches(pw, member.getPw())) {
            return member;
        }
        return null;
    }

    public void registerManager(String id, String pw, String name, String phone, String email) {
        if (managerMapper.findById(id) != null) {
            throw new RuntimeException("Username already exists");
        }
        Manager manager = new Manager();
        manager.setId(id);
        manager.setPw(passwordEncoder.encode(pw));
        manager.setName(name);
        manager.setPhone(phone);
        manager.setEmail(email);
        managerMapper.insertManager(manager);
    }

    public Manager authenticateManager(String id, String pw) {
        Manager manage = managerMapper.findById(id);
        if (manage != null && passwordEncoder.matches(pw, manage.getPw())) {
            return manage;
        }
        return null;
    }
}