package com.kh.backend.member;

import java.util.Date;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MemberService {
    private final MemberMapper memberMapper;
    private final PasswordEncoder passwordEncoder;

    public MemberService(MemberMapper memberMapper, PasswordEncoder passwordEncoder) {
        this.memberMapper = memberMapper;
        this.passwordEncoder = passwordEncoder;
    }
    public boolean idCheck(String id) {
        return memberMapper.findById(id) == null;
    }

    @Transactional
    public void registerMember(String id, String pw, String name, String phone, String email, Date birth,
            String gender) {
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

}
