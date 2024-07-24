package com.kh.backend.service;

import com.kh.backend.entity.Member;
import com.kh.backend.mapper.MemberMapper;
import org.springframework.stereotype.Service;

@Service
public class MemberServiceImpl implements MemberService{
    private final MemberMapper memberMapper;
    public MemberServiceImpl(MemberMapper memberMapper) {
        this.memberMapper = memberMapper;
    }
    @Override
    public boolean create(Member member) {
        return memberMapper.create(member) > 0;
    }
    @Override
    public boolean update(Member member) {
        return memberMapper.update(member) > 0;
    }
    @Override
    public Member read(int no) {
       return  memberMapper.read(no);
    }

    @Override
    public boolean delete(int no) {
        return memberMapper.delete(no) > 0;
    }
}
