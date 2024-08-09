package com.kh.backend.common.config;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import com.kh.backend.common.jwt.JwtAuthFilter;
import com.kh.backend.common.jwt.JwtUtil;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtUtil jwtUtil;

    public SecurityConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(Collections.singletonList("http://localhost:5173"));
                    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE"));
                    config.setAllowedHeaders(Arrays.asList("*"));
                    config.setAllowCredentials(true);
                    return config;
                }))
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/img/**").permitAll()
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/api/office/**").permitAll()
                        // .requestMatchers("/auth/kakao/**").permitAll()
                        // .requestMatchers("/auth/naver/**").permitAll()
                        // .requestMatchers("/auth/google/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/office/**").permitAll()
                       
                        // .requestMatchers(HttpMethod.GET, "/office/**").permitAll()
                        .requestMatchers("/member/register", "/manager/create").permitAll()
                        .requestMatchers("/member/check-id", "/member/reset-pw", "member/id-exist").permitAll()
                        .requestMatchers("/manager/id-check", "/manager/find-id", "/manager/reset-pw").permitAll()
                        .requestMatchers("/message/**").permitAll()
                        .requestMatchers("/manager/**").hasRole("MANAGER")
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .anyRequest().hasRole(
                                "MEMBER")
                        )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(new JwtAuthFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}