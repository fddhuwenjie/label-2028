package com.campus.lostfound.service;

import com.campus.lostfound.common.BusinessException;
import com.campus.lostfound.common.ErrorCode;
import com.campus.lostfound.common.PageResult;
import com.campus.lostfound.entity.User;
import com.campus.lostfound.mapper.UserMapper;
import com.campus.lostfound.util.PasswordUtil;
import com.campus.lostfound.util.ValidationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserMapper userMapper;

    public User findById(Long id) {
        return userMapper.findById(id);
    }

    public User findByUsername(String username) {
        return userMapper.findByUsername(username);
    }

    public User register(User user) {
        logger.info("用户注册: username={}", user.getUsername());
        User existing = userMapper.findByUsername(user.getUsername());
        if (existing != null) {
            logger.warn("注册失败，用户名已存在: {}", user.getUsername());
            throw new BusinessException(ErrorCode.USER_EXISTS);
        }
        if (user.getPassword() == null || user.getPassword().length() < 6) {
            throw new BusinessException(ErrorCode.PASSWORD_TOO_SHORT);
        }
        ValidationUtil.validatePhone(user.getPhone(), "手机号");
        user.setPassword(PasswordUtil.encrypt(user.getPassword()));
        user.setRole(0);
        user.setStatus(1);
        userMapper.insert(user);
        logger.info("用户注册成功: id={}, username={}", user.getId(), user.getUsername());
        return user;
    }

    public User login(String username, String password) {
        logger.info("用户登录: username={}", username);
        User user = userMapper.findByUsername(username);
        if (user == null) {
            logger.warn("登录失败，用户不存在: {}", username);
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        if (user.getStatus() == 0) {
            logger.warn("登录失败，账号已禁用: {}", username);
            throw new BusinessException(ErrorCode.USER_DISABLED);
        }
        if (!PasswordUtil.verify(password, user.getPassword())) {
            logger.warn("登录失败，密码错误: {}", username);
            throw new BusinessException(ErrorCode.PASSWORD_ERROR);
        }
        logger.info("用户登录成功: id={}, username={}", user.getId(), username);
        return user;
    }

    public void update(User user) {
        ValidationUtil.validatePhone(user.getPhone(), "手机号");
        userMapper.update(user);
        logger.info("用户信息更新: id={}", user.getId());
    }

    public void updatePassword(Long id, String oldPassword, String newPassword) {
        User user = userMapper.findById(id);
        if (!PasswordUtil.verify(oldPassword, user.getPassword())) {
            throw new BusinessException(ErrorCode.PASSWORD_ERROR, "原密码错误");
        }
        if (newPassword == null || newPassword.length() < 6) {
            throw new BusinessException(ErrorCode.PASSWORD_TOO_SHORT);
        }
        userMapper.updatePassword(id, PasswordUtil.encrypt(newPassword));
        logger.info("用户密码修改成功: id={}", id);
    }

    public void updateStatus(Long id, Integer status) {
        userMapper.updateStatus(id, status);
        logger.info("用户状态更新: id={}, status={}", id, status);
    }

    public PageResult<User> findPage(String keyword, Integer page, Integer size) {
        int offset = (page - 1) * size;
        List<User> list = userMapper.findPage(keyword, offset, size);
        Long total = userMapper.count(keyword);
        list.forEach(u -> u.setPassword(null));
        return PageResult.of(list, total, page, size);
    }

    public Long countAll() {
        return userMapper.countAll();
    }
}
