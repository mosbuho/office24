package com.kh.backend.member;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MemberMapper {
    void insertMember(Member member);

    Member findById(String id);

    Member findByEmail(String email);

    Member findByPhone(String phone);

    List<String> findIdByPhone(String phone);

    void resetPw(String pw, String id);

    List<Member> getAllMembers(@Param("start") int start, @Param("end") int end,
            @Param("f") String f, @Param("q") String q);

    int getTotalMemberCount(@Param("f") String f, @Param("q") String q);

    void resetPassword(int memberId);

    void updateMember(Member member);

    void deleteMember(int memberId);
}