package com.campus.lostfound.common;

/**
 * 统一错误码
 */
public enum ErrorCode {
    // 通用错误 1xxx
    SUCCESS(0, "成功"),
    PARAM_ERROR(1001, "参数错误"),
    SYSTEM_ERROR(1002, "系统错误"),
    
    // 认证错误 2xxx
    UNAUTHORIZED(2001, "请先登录"),
    TOKEN_EXPIRED(2002, "登录已过期，请重新登录"),
    FORBIDDEN(2003, "无权限操作"),
    
    // 用户错误 3xxx
    USER_NOT_FOUND(3001, "用户不存在"),
    USER_EXISTS(3002, "用户名已存在"),
    PASSWORD_ERROR(3003, "密码错误"),
    USER_DISABLED(3004, "账号已被禁用"),
    PASSWORD_TOO_SHORT(3005, "密码长度不能少于6位"),
    
    // 物品错误 4xxx
    ITEM_NOT_FOUND(4001, "物品不存在"),
    ITEM_NOT_OWNER(4002, "无权操作此物品"),
    ITEM_NO_PERMISSION(4003, "无权操作此物品");

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
