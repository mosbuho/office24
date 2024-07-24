package com.kh.backend.controller;

import com.kh.backend.entity.Member;
import com.kh.backend.service.MemberService;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/member")
public class MemberController {
    private final MemberService memberService;
    MemberController(MemberService memberService) {
        this.memberService = memberService;
    }
    @PostMapping("/register")
    public String createMember(@Validated @RequestBody Member member, BindingResult result) {
        if (result.hasErrors()) {
            return result.getAllErrors().toString();
        }
        boolean success = memberService.create(member);
        if (success) {
            return "회원가입 성공";
        } else {
            return "회원가입 실패";
        }
    }
}
