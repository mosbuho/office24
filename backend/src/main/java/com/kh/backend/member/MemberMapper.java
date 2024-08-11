package com.kh.backend.member;

import java.util.List;
import java.util.Map;

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

    void resetMemberPw(int no);

    void updateMember(Member member);

    void deleteMember(int no);

    Member getMemberById(int no);

    void updateMemberProfile(Member member);

    void updatePassword(int no, String newPassword);

    boolean checkLikeExists(@Param("userNo") int userNo, @Param("officeNo") int officeNo);

    void addLike(@Param("userNo") int userNo, @Param("officeNo") int officeNo);

    void removeLike(@Param("userNo") int userNo, @Param("officeNo") int officeNo);

    int getLikeCount(@Param("officeNo") int officeNo);

    List<Map<String, Object>> getFavoriteOffices(@Param("userNo") int userNo);

    List<Integer> getLikedOfficeNumbers(@Param("userNo") int userNo);
}