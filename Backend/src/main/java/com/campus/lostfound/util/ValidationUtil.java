package com.campus.lostfound.util;

import java.util.regex.Pattern;

/**
 * 校验工具类
 */
public class ValidationUtil {

    // 中国大陆手机号正则：1开头，第二位3-9，后面9位数字
    private static final Pattern PHONE_PATTERN = Pattern.compile("^1[3-9]\\d{9}$");

    /**
     * 校验手机号格式
     * @param phone 手机号
     * @return true-有效，false-无效
     */
    public static boolean isValidPhone(String phone) {
        if (phone == null || phone.isEmpty()) {
            return true; // 允许为空
        }
        return PHONE_PATTERN.matcher(phone).matches();
    }

    /**
     * 校验手机号，无效则抛出异常
     * @param phone 手机号
     * @param fieldName 字段名称（用于错误提示）
     */
    public static void validatePhone(String phone, String fieldName) {
        if (!isValidPhone(phone)) {
            throw new IllegalArgumentException(fieldName + "格式不正确");
        }
    }
}
