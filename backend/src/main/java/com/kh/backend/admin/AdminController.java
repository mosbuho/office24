package com.kh.backend.admin;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.backend.member.MemberService;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private MemberService memberService;

    @GetMapping("/member")
    public Map<String, Object> getAllMembers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "30") int size) {
        return memberService.getMembersWithPagination(page, size);
    }
}
