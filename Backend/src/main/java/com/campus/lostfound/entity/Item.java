package com.campus.lostfound.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Item {
    private Long id;
    private Long userId;
    private String title;
    private String description;
    private String category;
    private String location;
    private String images;
    private Integer type; // 0: lost, 1: found
    private Integer status; // 0: pending, 1: approved, 2: rejected, 3: claimed
    private String contactName;
    private String contactPhone;
    private LocalDateTime itemTime;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    
    // Non-persistent field
    private String username;
}
