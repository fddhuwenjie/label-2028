package com.campus.lostfound.controller;

import com.campus.lostfound.common.BusinessException;
import com.campus.lostfound.common.ErrorCode;
import com.campus.lostfound.common.PageResult;
import com.campus.lostfound.common.Result;
import com.campus.lostfound.entity.Item;
import com.campus.lostfound.service.ItemService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/item")
public class ItemController {

    private static final Logger logger = LoggerFactory.getLogger(ItemController.class);

    @Autowired
    private ItemService itemService;

    @GetMapping("/{id}")
    public Result<?> getById(@PathVariable Long id) {
        Item item = itemService.findById(id);
        return Result.success(item);
    }

    @GetMapping("/list")
    public Result<?> list(
            @RequestParam(required = false) Integer type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        logger.debug("查询物品列表: type={}, category={}, keyword={}, page={}", type, category, keyword, page);
        PageResult<Item> result = itemService.findPage(type, 1, category, keyword, null, page, size);
        return Result.success(result);
    }

    @GetMapping("/my")
    public Result<?> myItems(
            HttpServletRequest request,
            @RequestParam(required = false) Integer type,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }
        PageResult<Item> result = itemService.findPage(type, null, null, null, userId, page, size);
        return Result.success(result);
    }

    /**
     * 智能匹配：根据物品ID查找相似物品
     */
    @GetMapping("/{id}/similar")
    public Result<?> findSimilar(@PathVariable Long id, @RequestParam(defaultValue = "5") Integer limit) {
        logger.info("智能匹配请求: itemId={}, limit={}", id, limit);
        List<Item> similarItems = itemService.findMatches(id, limit);
        return Result.success(similarItems);
    }

    @PostMapping
    public Result<?> create(HttpServletRequest request, @RequestBody Item item) {
        Long userId = (Long) request.getAttribute("userId");
        item.setUserId(userId);
        itemService.create(item);
        return Result.success(item);
    }

    @PutMapping("/{id}")
    public Result<?> update(HttpServletRequest request, @PathVariable Long id, @RequestBody Item item) {
        Long userId = (Long) request.getAttribute("userId");
        Item existing = itemService.findById(id);
        if (!existing.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.ITEM_NO_PERMISSION);
        }
        item.setId(id);
        itemService.update(item);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(HttpServletRequest request, @PathVariable Long id) {
        Long userId = (Long) request.getAttribute("userId");
        Item existing = itemService.findById(id);
        if (!existing.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.ITEM_NO_PERMISSION);
        }
        itemService.delete(id);
        return Result.success();
    }
}
