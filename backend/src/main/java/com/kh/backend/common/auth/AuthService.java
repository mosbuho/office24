package com.kh.backend.common.auth;

import java.util.Date;

import org.springframework.dao.DataIntegrityViolationException;
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

    public String getRoleByUsername(String username) {
        if (adminMapper.findById(username) != null) {
            return "ROLE_ADMIN";
        } else if (managerMapper.findById(username) != null) {
            return "ROLE_MANAGER";
        } else if (memberMapper.findById(username) != null) {
            return "ROLE_MEMBER";
        }
        throw new RuntimeException("로그인 정보를 찾을 수 없습니다.");
    }
    public boolean idCheckMember(String id)   {
        return memberMapper.findById(id) == null;
    }

    @Transactional
    public void registerMember(String id, String pw, String name, String phone, String email, Date birth,
            String gender) {
        if (memberMapper.findById(id) != null) {
            throw new RuntimeException("동일한 아이디가 존재합니다.");
        }
        Member member = new Member();
        member.setId(id);
        member.setPw(passwordEncoder.encode(pw));
        member.setName(name);
        member.setPhone(phone);
        member.setEmail(email);
        member.setBirth(birth);
        member.setGender(gender);
        try {
            memberMapper.insertMember(member);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("알 수 없는 오류가 발생했습니다.");
        }
    }

    @Transactional
    public void registerManager(String id, String pw, String name, String phone, String email) {
        Manager manager = new Manager();
        manager.setId(id);
        manager.setPw(passwordEncoder.encode(pw));
        manager.setName(name);
        manager.setPhone(phone);
        manager.setEmail(email);
        try {
            managerMapper.insertManager(manager);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("알 수 없는 오류가 발생했습니다.");
        }
    }

    @Transactional
    public boolean idCheckManager(String id) {
        return managerMapper.findById(id) == null;
    }

}