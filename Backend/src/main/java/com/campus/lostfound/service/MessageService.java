package com.campus.lostfound.service;

import com.campus.lostfound.common.PageResult;
import com.campus.lostfound.entity.Message;
import com.campus.lostfound.mapper.MessageMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    private static final Logger logger = LoggerFactory.getLogger(MessageService.class);

    @Autowired
    private MessageMapper messageMapper;

    public void send(Message message) {
        messageMapper.insert(message);
        logger.info("消息发送: senderId={}, receiverId={}, itemId={}", 
                message.getSenderId(), message.getReceiverId(), message.getItemId());
    }

    public PageResult<Message> findByUserId(Long userId, Integer page, Integer size) {
        int offset = (page - 1) * size;
        List<Message> list = messageMapper.findByUserId(userId, offset, size);
        Long total = messageMapper.countByUserId(userId);
        return PageResult.of(list, total, page, size);
    }

    public Long countUnread(Long userId) {
        return messageMapper.countUnread(userId);
    }

    public void markAsRead(Long id, Long receiverId) {
        messageMapper.markAsRead(id, receiverId);
        logger.debug("消息已读: id={}, receiverId={}", id, receiverId);
    }

    public void markAllAsRead(Long userId) {
        messageMapper.markAllAsRead(userId);
        logger.info("全部消息已读: userId={}", userId);
    }

    public List<Message> findByItemId(Long itemId) {
        return messageMapper.findByItemId(itemId);
    }
}
