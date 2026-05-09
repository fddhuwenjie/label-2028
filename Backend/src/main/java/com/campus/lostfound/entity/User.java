package com.campus.lostfound.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class User {
    private Long id;
    private String username;
    private String password;
    private String realName;
    private String phone;
    private String email;
    private String studentId;
    private String department;
    private String avatar;
    private Integer role; // 0: user, 1: admin
    private Integer status; // 0: disabled, 1: active
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
