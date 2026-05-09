package com.campus.lostfound.mapper;

import com.campus.lostfound.entity.Message;
import org.apache.ibatis.annotations.*;
import java.util.List;

public interface MessageMapper {

    @Insert("INSERT INTO message(item_id, sender_id, receiver_id, content, is_read, create_time) " +
            "VALUES(#{itemId}, #{senderId}, #{receiverId}, #{content}, 0, NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Message message);

    @Select("SELECT m.*, s.username as sender_name, r.username as receiver_name, i.title as item_title " +
            "FROM message m " +
            "LEFT JOIN user s ON m.sender_id = s.id " +
            "LEFT JOIN user r ON m.receiver_id = r.id " +
            "LEFT JOIN item i ON m.item_id = i.id " +
            "WHERE m.receiver_id = #{userId} OR m.sender_id = #{userId} " +
            "ORDER BY m.create_time DESC " +
            "LIMIT #{offset}, #{size}")
    List<Message> findByUserId(@Param("userId") Long userId, @Param("offset") Integer offset, @Param("size") Integer size);

    @Select("SELECT COUNT(*) FROM message WHERE receiver_id = #{userId} OR sender_id = #{userId}")
    Long countByUserId(Long userId);

    @Select("SELECT COUNT(*) FROM message WHERE receiver_id = #{userId} AND is_read = 0")
    Long countUnread(Long userId);

    @Update("UPDATE message SET is_read = 1 WHERE id = #{id} AND receiver_id = #{receiverId}")
    int markAsRead(@Param("id") Long id, @Param("receiverId") Long receiverId);

    @Update("UPDATE message SET is_read = 1 WHERE receiver_id = #{userId}")
    int markAllAsRead(Long userId);

    @Select("SELECT m.*, s.username as sender_name, r.username as receiver_name, i.title as item_title " +
            "FROM message m " +
            "LEFT JOIN user s ON m.sender_id = s.id " +
            "LEFT JOIN user r ON m.receiver_id = r.id " +
            "LEFT JOIN item i ON m.item_id = i.id " +
            "WHERE m.item_id = #{itemId} " +
            "ORDER BY m.create_time ASC")
    List<Message> findByItemId(Long itemId);
}
