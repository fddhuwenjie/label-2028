package com.campus.lostfound.interceptor;

import com.campus.lostfound.common.ErrorCode;
import com.campus.lostfound.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

/**
 * 认证拦截器
 */
public class AuthInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(AuthInterceptor.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();

    private JwtUtil jwtUtil;

    @Autowired
    public void setJwtUtil(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 放行 OPTIONS 请求
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            logger.warn("认证失败: 缺少Token, uri={}", request.getRequestURI());
            writeErrorResponse(response, ErrorCode.UNAUTHORIZED);
            return false;
        }

        try {
            token = token.substring(7);
            Long userId = jwtUtil.getUserId(token);
            String username = jwtUtil.getUsername(token);
            Integer role = jwtUtil.getRole(token);

            request.setAttribute("userId", userId);
            request.setAttribute("username", username);
            request.setAttribute("role", role);
            
            logger.debug("认证成功: userId={}, username={}, uri={}", userId, username, request.getRequestURI());
            return true;
        } catch (Exception e) {
            logger.warn("认证失败: Token无效, uri={}, error={}", request.getRequestURI(), e.getMessage());
            writeErrorResponse(response, ErrorCode.TOKEN_EXPIRED);
            return false;
        }
    }

    /**
     * 写入统一格式的错误响应
     */
    private void writeErrorResponse(HttpServletResponse response, ErrorCode errorCode) throws Exception {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        
        Map<String, Object> result = new HashMap<>();
        result.put("code", errorCode.getCode());
        result.put("message", errorCode.getMessage());
        result.put("data", null);
        
        response.getWriter().write(objectMapper.writeValueAsString(result));
    }
}
