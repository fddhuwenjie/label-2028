package com.campus.lostfound.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Message {
    private Long id;
    private Long itemId;
    private Long senderId;
    private Long receiverId;
    private String content;
    private Integer isRead; // 0: unread, 1: read
    private LocalDateTime createTime;
    
    // Non-persistent fields
    private String senderName;
    private String receiverName;
    private String itemTitle;
}
