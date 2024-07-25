package com.kh.backend.member;


public interface MemberService {
    boolean create(Member member);
    boolean update(Member member);
    Member read(int no);
    boolean delete(int no);
    boolean idCheck(String id);
}
