package com.kh.backend.member;


import org.springframework.stereotype.Service;

@Service
public class MemberServiceImpl implements MemberService {
    private final MemberMapper memberMapper;

    public MemberServiceImpl(MemberMapper memberMapper) {
        this.memberMapper = memberMapper;
    }

    @Override
    public boolean create(Member member) {
        System.out.println("create 메소드");
        try {
            memberMapper.create(member);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean update(Member member) {
        return memberMapper.update(member) > 0;
    }

    @Override
    public Member read(int no) {
        return memberMapper.read(no);
    }

    @Override
    public boolean delete(int no) {
        return memberMapper.delete(no) > 0;
    }

    @Override
    public boolean idCheck(String id) {
        return !(memberMapper.idCheck(id) > 0);
    }
}
