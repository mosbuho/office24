package com.kh.backend.mapper;

import com.kh.backend.entity.Member;

public interface MemberMapper {
    int create(Member member);
    int update(Member member);
    Member read(int no);
    int delete(int no);
}
