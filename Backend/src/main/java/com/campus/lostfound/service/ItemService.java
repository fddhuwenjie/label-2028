package com.campus.lostfound.service;

import com.campus.lostfound.common.BusinessException;
import com.campus.lostfound.common.ErrorCode;
import com.campus.lostfound.common.PageResult;
import com.campus.lostfound.entity.Item;
import com.campus.lostfound.mapper.ItemMapper;
import com.campus.lostfound.util.ValidationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ItemService {

    private static final Logger logger = LoggerFactory.getLogger(ItemService.class);

    @Autowired
    private ItemMapper itemMapper;

    public Item findById(Long id) {
        Item item = itemMapper.findById(id);
        if (item == null) {
            throw new BusinessException(ErrorCode.ITEM_NOT_FOUND);
        }
        return item;
    }

    public void create(Item item) {
        logger.info("发布物品: type={}, title={}, userId={}", item.getType(), item.getTitle(), item.getUserId());
        if (item.getContactPhone() == null || item.getContactPhone().isEmpty()) {
            throw new IllegalArgumentException("联系电话不能为空");
        }
        ValidationUtil.validatePhone(item.getContactPhone(), "联系电话");
        item.setStatus(0); // pending approval
        itemMapper.insert(item);
        logger.info("物品发布成功: id={}, title={}", item.getId(), item.getTitle());
    }

    public void update(Item item) {
        ValidationUtil.validatePhone(item.getContactPhone(), "联系电话");
        itemMapper.update(item);
        logger.info("物品更新: id={}", item.getId());
    }

    public void updateStatus(Long id, Integer status) {
        itemMapper.updateStatus(id, status);
        logger.info("物品状态更新: id={}, status={}", id, status);
    }

    public void delete(Long id) {
        itemMapper.delete(id);
        logger.info("物品删除: id={}", id);
    }

    public PageResult<Item> findPage(Integer type, Integer status, String category, String keyword, Long userId, Integer page, Integer size) {
        int offset = (page - 1) * size;
        List<Item> list = itemMapper.findPage(type, status, category, keyword, userId, offset, size);
        Long total = itemMapper.count(type, status, category, keyword, userId);
        return PageResult.of(list, total, page, size);
    }

    /**
     * 智能匹配：根据物品查找可能匹配的物品
     * 匹配逻辑：
     * 1. 类型相反（失物找招领，招领找失物）
     * 2. 相同分类优先
     * 3. 相似地点优先
     * 4. 时间接近优先（7天内）
     */
    public List<Item> findMatches(Long itemId, Integer limit) {
        Item item = findById(itemId);
        logger.info("智能匹配: itemId={}, type={}, category={}, location={}", 
                itemId, item.getType(), item.getCategory(), item.getLocation());
        
        // 查找相反类型的物品（失物找招领，招领找失物）
        Integer matchType = item.getType() == 0 ? 1 : 0;
        List<Item> matches = itemMapper.findMatches(
                matchType, 
                item.getCategory(), 
                item.getLocation(), 
                item.getCreateTime(),
                itemId,
                limit
        );
        logger.info("智能匹配结果: itemId={}, matchCount={}", itemId, matches.size());
        return matches;
    }

    public Long countByType(Integer type) {
        return itemMapper.countByType(type);
    }

    public Long countByStatus(Integer status) {
        return itemMapper.countByStatus(status);
    }

    public List<Map<String, Object>> countByCategory() {
        return itemMapper.countByCategory();
    }
}
