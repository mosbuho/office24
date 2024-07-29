package com.kh.backend.common.jwt;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
    private final Key accessKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final Key refreshKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long accessTokenExpiration = 1000 * 60 * 60 * 1;
    private final long refreshTokenExpiration = 1000 * 60 * 60 * 24;

    public String generateAccessToken(String username, String role, int no) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .claim("no", no)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(accessKey)
                .compact();
    }

    public String generateRefreshToken(String username, String role, int no) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .claim("no", no)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(refreshKey)
                .compact();
    }

    public boolean validateAccessToken(String accessToken) {
        try {
            Jwts.parserBuilder().setSigningKey(accessKey).build().parseClaimsJws(accessToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean validateRefreshToken(String refreshToken) {
        try {
            Jwts.parserBuilder().setSigningKey(refreshKey).build().parseClaimsJws(refreshToken);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    public String getUsernameFromAccessToken(String accessToken) {
        return Jwts.parserBuilder().setSigningKey(accessKey).build()
                .parseClaimsJws(accessToken).getBody().getSubject();
    }

    public String getUsernameFromRefreshToken(String refreshToken) {
        return Jwts.parserBuilder().setSigningKey(refreshKey).build()
                .parseClaimsJws(refreshToken).getBody().getSubject();
    }

    public String getRoleFromAccessToken(String accessToken) {
        return Jwts.parserBuilder().setSigningKey(accessKey).build()
                .parseClaimsJws(accessToken).getBody().get("role", String.class);
    }

    public String getRoleFromRefreshToken(String refreshToken) {
        return Jwts.parserBuilder().setSigningKey(refreshKey).build()
                .parseClaimsJws(refreshToken).getBody().get("role", String.class);
    }

    public int getNoFromAccessToken(String accessToken) {
        return Jwts.parserBuilder().setSigningKey(accessKey).build()
                .parseClaimsJws(accessToken).getBody().get("no", Integer.class);
    }

    public int getNoFromRefreshToken(String refreshToken) {
        return Jwts.parserBuilder().setSigningKey(refreshKey).build()
                .parseClaimsJws(refreshToken).getBody().get("no", Integer.class);
    }
}