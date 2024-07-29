package com.kh.backend.member;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberMapper {
    void insertMember(Member member);
    Member findById(String id);
    Member findByEmail(String email);
}