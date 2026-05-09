package com.campus.lostfound.controller;

import com.campus.lostfound.common.BusinessException;
import com.campus.lostfound.common.ErrorCode;
import com.campus.lostfound.common.PageResult;
import com.campus.lostfound.common.Result;
import com.campus.lostfound.entity.Item;
import com.campus.lostfound.entity.User;
import com.campus.lostfound.service.ItemService;
import com.campus.lostfound.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private ItemService itemService;

    private void checkAdmin(HttpServletRequest request) {
        Integer role = (Integer) request.getAttribute("role");
        if (role == null || role != 1) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "需要管理员权限");
        }
    }

    @GetMapping("/stats")
    public Result<?> stats(HttpServletRequest request) {
        checkAdmin(request);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("userCount", userService.countAll());
        stats.put("lostCount", itemService.countByType(0));
        stats.put("foundCount", itemService.countByType(1));
        stats.put("pendingCount", itemService.countByStatus(0));
        stats.put("approvedCount", itemService.countByStatus(1));
        stats.put("rejectedCount", itemService.countByStatus(2));
        stats.put("claimedCount", itemService.countByStatus(3));
        stats.put("categoryStats", itemService.countByCategory());
        return Result.success(stats);
    }

    @GetMapping("/users")
    public Result<?> users(
            HttpServletRequest request,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        checkAdmin(request);
        PageResult<User> result = userService.findPage(keyword, page, size);
        return Result.success(result);
    }

    @PutMapping("/user/{id}/status")
    public Result<?> updateUserStatus(
            HttpServletRequest request,
            @PathVariable Long id,
            @RequestBody Map<String, Integer> params) {
        checkAdmin(request);
        Integer status = params.get("status");
        userService.updateStatus(id, status);
        logger.info("管理员更新用户状态: userId={}, status={}", id, status);
        return Result.success();
    }

    @GetMapping("/items")
    public Result<?> items(
            HttpServletRequest request,
            @RequestParam(required = false) Integer type,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        checkAdmin(request);
        PageResult<Item> result = itemService.findPage(type, status, null, keyword, null, page, size);
        return Result.success(result);
    }

    @PutMapping("/item/{id}/status")
    public Result<?> updateItemStatus(
            HttpServletRequest request,
            @PathVariable Long id,
            @RequestBody Map<String, Integer> params) {
        checkAdmin(request);
        Integer status = params.get("status");
        itemService.updateStatus(id, status);
        logger.info("管理员审核物品: itemId={}, status={}", id, status);
        return Result.success();
    }

    @DeleteMapping("/item/{id}")
    public Result<?> deleteItem(HttpServletRequest request, @PathVariable Long id) {
        checkAdmin(request);
        itemService.delete(id);
        logger.info("管理员删除物品: itemId={}", id);
        return Result.success();
    }
}
