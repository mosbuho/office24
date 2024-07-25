package com.kh.backend.member;


import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberMapper {
    int create(Member member);
    int update(Member member);
    Member read(int no);
    int delete(int no);
    int idCheck(String id);
}
