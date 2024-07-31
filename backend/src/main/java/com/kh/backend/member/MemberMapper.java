package com.kh.backend.member;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MemberMapper {
    void insertMember(Member member);
    Member findById(String id);
    Member findByEmail(String email);
    Member findByPhone(String phone);
    List<String> findIdByPhone(String phone);
    void resetPw(String pw, String id);
}