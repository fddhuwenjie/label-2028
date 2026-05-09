package com.campus.lostfound.mapper;

import com.campus.lostfound.entity.User;
import org.apache.ibatis.annotations.*;
import java.util.List;

public interface UserMapper {

    @Select("SELECT * FROM user WHERE id = #{id}")
    User findById(Long id);

    @Select("SELECT * FROM user WHERE username = #{username}")
    User findByUsername(String username);

    @Insert("INSERT INTO user(username, password, real_name, phone, email, student_id, department, role, status, create_time, update_time) " +
            "VALUES(#{username}, #{password}, #{realName}, #{phone}, #{email}, #{studentId}, #{department}, #{role}, #{status}, NOW(), NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);

    @Update("UPDATE user SET real_name=#{realName}, phone=#{phone}, email=#{email}, student_id=#{studentId}, department=#{department}, update_time=NOW() WHERE id=#{id}")
    int update(User user);

    @Update("UPDATE user SET password=#{password}, update_time=NOW() WHERE id=#{id}")
    int updatePassword(@Param("id") Long id, @Param("password") String password);

    @Update("UPDATE user SET status=#{status}, update_time=NOW() WHERE id=#{id}")
    int updateStatus(@Param("id") Long id, @Param("status") Integer status);

    Long count(@Param("keyword") String keyword);

    List<User> findPage(@Param("keyword") String keyword, @Param("offset") Integer offset, @Param("size") Integer size);

    @Select("SELECT COUNT(*) FROM user")
    Long countAll();
}
