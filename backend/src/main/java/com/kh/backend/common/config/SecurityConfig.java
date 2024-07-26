package com.kh.backend.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;


@Configuration // 스프링의 환경설정 파일임을 의미하는 애너테이션
@EnableWebSecurity // 모든 요청 URL이 스프링 시큐리티의 제어를 받도록 만드는 애너테이션
@EnableMethodSecurity(prePostEnabled=true, securedEnabled=true)
public class SecurityConfig {
/*
    private final CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;
    public SecurityConfig(CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler) {
        this.customAuthenticationSuccessHandler = customAuthenticationSuccessHandler;
    }
    */

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.authorizeRequests().requestMatchers("/member/**").permitAll();
/*
        // Spring Security 기본 로그인 사용하지 않는 페이지 설정 (전체)
        http.authorizeRequests().requestMatchers("/customer/**").hasRole("CUSTOMER");
        http.authorizeRequests().requestMatchers("/admin/**").hasRole("ADMIN");


        // CSRF 토큰 활성화
        http.csrf(Customizer.withDefaults());

 */
/*
        // 로그인 -> 자세한 로직은 UserSecurityService.java 확인
        http.formLogin((formLogin) -> formLogin
                .loginPage("/login")
                .usernameParameter("userId")
                .passwordParameter("userPw")
                .successHandler(customAuthenticationSuccessHandler));

        http.logout((formLogout) -> formLogout
                .logoutUrl("/customer/logout"));
                */
        return http.build();
        // usernameParameter 를 이용하여 UserDetailService 구현체에서 매개변수로 받을 매개변수명을 지정할 수 있다
        // passwordParameter 역시 마찬가지이다
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
        // AuthenticationManager는 스프링 시큐리티의 인증을 담당
        // PasswordEncoder와 UserDetailsService 구현체가 자동으로 설정되어 동작
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    // 비밀번호 암호화 모듈
}