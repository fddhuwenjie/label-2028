package com.campus.lostfound.mapper;

import com.campus.lostfound.entity.Item;
import org.apache.ibatis.annotations.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface ItemMapper {

    @Select("SELECT i.*, u.username FROM item i LEFT JOIN user u ON i.user_id = u.id WHERE i.id = #{id}")
    Item findById(Long id);

    @Insert("INSERT INTO item(user_id, title, description, category, location, images, type, status, contact_name, contact_phone, item_time, create_time, update_time) " +
            "VALUES(#{userId}, #{title}, #{description}, #{category}, #{location}, #{images}, #{type}, #{status}, #{contactName}, #{contactPhone}, #{itemTime}, NOW(), NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Item item);

    @Update("UPDATE item SET title=#{title}, description=#{description}, category=#{category}, location=#{location}, images=#{images}, contact_name=#{contactName}, contact_phone=#{contactPhone}, item_time=#{itemTime}, update_time=NOW() WHERE id=#{id}")
    int update(Item item);

    @Update("UPDATE item SET status=#{status}, update_time=NOW() WHERE id=#{id}")
    int updateStatus(@Param("id") Long id, @Param("status") Integer status);

    @Delete("DELETE FROM item WHERE id = #{id}")
    int delete(Long id);

    List<Item> findPage(@Param("type") Integer type, @Param("status") Integer status, @Param("category") String category, 
                        @Param("keyword") String keyword, @Param("userId") Long userId, @Param("offset") Integer offset, @Param("size") Integer size);

    Long count(@Param("type") Integer type, @Param("status") Integer status, @Param("category") String category, 
               @Param("keyword") String keyword, @Param("userId") Long userId);

    /**
     * 智能匹配：查找可能匹配的物品
     * 匹配逻辑：类型相反 + 相同分类优先 + 相似地点优先 + 时间接近优先
     */
    List<Item> findMatches(@Param("matchType") Integer matchType, @Param("category") String category, 
                           @Param("location") String location, @Param("createTime") LocalDateTime createTime,
                           @Param("excludeId") Long excludeId, @Param("limit") Integer limit);

    @Select("SELECT COUNT(*) FROM item WHERE type = #{type}")
    Long countByType(Integer type);

    @Select("SELECT COUNT(*) FROM item WHERE status = #{status}")
    Long countByStatus(Integer status);

    @Select("SELECT category, COUNT(*) as count FROM item WHERE status = 1 GROUP BY category")
    List<Map<String, Object>> countByCategory();
}
