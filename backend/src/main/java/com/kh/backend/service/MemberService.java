package com.kh.backend.service;

import com.kh.backend.entity.Member;

public interface MemberService {
    boolean create(Member member);

    boolean update(Member member);
    Member read(int no);



    boolean delete(int no);
}
