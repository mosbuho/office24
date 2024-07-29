package com.kh.backend.manager;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Manager {
    private int no;
    @NotBlank(message = "아이디는 필수 입력 값입니다.")
    @Size(min = 6, max = 12, message = "아이디는 6자 이상 12자 이하의 영문자와 숫자만 가능합니다.")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "아이디는 영문자와 숫자만 가능합니다.")
    private String id;

    @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
    @Size(min = 8, max = 16, message = "비밀번호는 8자 이상 16자 이하의 영문, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.")
    @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,16}$", message = "비밀번호는 영문, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.")
    private String pw;

    @NotBlank(message = "이름은 필수 입력 값입니다.")
    @Size(min = 2, max = 12, message = "이름은 2자 이상 12자 이하의 한글만 가능합니다.")
    @Pattern(regexp = "^[가-힣]+$", message = "이름은 한글만 가능합니다.")
    private String name;

    @NotBlank(message = "전화번호는 필수 입력 값입니다.")
    @Pattern(regexp = "^\\d{11}$", message = "전화번호는 11자리 숫자만 가능합니다.")
    private String phone;

    @Email(message = "이메일 형식이 올바르지 않습니다.")
    private String email;
}