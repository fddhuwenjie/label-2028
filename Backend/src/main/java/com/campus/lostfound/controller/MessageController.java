package com.campus.lostfound.controller;

import com.campus.lostfound.common.PageResult;
import com.campus.lostfound.common.Result;
import com.campus.lostfound.entity.Item;
import com.campus.lostfound.entity.Message;
import com.campus.lostfound.service.ItemService;
import com.campus.lostfound.service.MessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/message")
public class MessageController {

    private static final Logger logger = LoggerFactory.getLogger(MessageController.class);

    @Autowired
    private MessageService messageService;

    @Autowired
    private ItemService itemService;

    @PostMapping
    public Result<?> send(HttpServletRequest request, @RequestBody Message message) {
        Long userId = (Long) request.getAttribute("userId");
        message.setSenderId(userId);
        
        Item item = itemService.findById(message.getItemId());
        if (item != null) {
            message.setReceiverId(item.getUserId());
        }
        
        messageService.send(message);
        return Result.success();
    }

    @GetMapping("/list")
    public Result<?> list(
            HttpServletRequest request,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Long userId = (Long) request.getAttribute("userId");
        PageResult<Message> result = messageService.findByUserId(userId, page, size);
        return Result.success(result);
    }

    @GetMapping("/unread")
    public Result<?> unreadCount(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        Long count = messageService.countUnread(userId);
        return Result.success(count);
    }

    @PutMapping("/read/{id}")
    public Result<?> markAsRead(HttpServletRequest request, @PathVariable Long id) {
        Long userId = (Long) request.getAttribute("userId");
        messageService.markAsRead(id, userId);
        return Result.success();
    }

    @PutMapping("/read-all")
    public Result<?> markAllAsRead(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        messageService.markAllAsRead(userId);
        return Result.success();
    }

    @GetMapping("/item/{itemId}")
    public Result<?> getByItemId(@PathVariable Long itemId) {
        List<Message> messages = messageService.findByItemId(itemId);
        return Result.success(messages);
    }
}
