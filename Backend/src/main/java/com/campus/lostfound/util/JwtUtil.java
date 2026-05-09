package com.campus.lostfound.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    // 默认值，防止配置未加载时出错
    private static final String DEFAULT_SECRET = "campus-lost-found-secret-key-2024";
    private static final Long DEFAULT_EXPIRATION = 86400000L;

    @PostConstruct
    public void init() {
        if (secret == null || secret.isEmpty()) {
            secret = DEFAULT_SECRET;
        }
        if (expiration == null) {
            expiration = DEFAULT_EXPIRATION;
        }
    }

    public String generateToken(Long userId, String username, Integer role) {
        return JWT.create()
                .withClaim("userId", userId)
                .withClaim("username", username)
                .withClaim("role", role)
                .withExpiresAt(new Date(System.currentTimeMillis() + expiration))
                .sign(Algorithm.HMAC256(secret));
    }

    public DecodedJWT verifyToken(String token) {
        return JWT.require(Algorithm.HMAC256(secret))
                .build()
                .verify(token);
    }

    public Long getUserId(String token) {
        return verifyToken(token).getClaim("userId").asLong();
    }

    public String getUsername(String token) {
        return verifyToken(token).getClaim("username").asString();
    }

    public Integer getRole(String token) {
        return verifyToken(token).getClaim("role").asInt();
    }
}
