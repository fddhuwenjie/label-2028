package com.campus.lostfound.util;

import org.junit.Test;
import static org.junit.Assert.*;

/**
 * ValidationUtil 单元测试
 */
public class ValidationUtilTest {

    // ========== isValidPhone 测试 ==========

    @Test
    public void testIsValidPhone_validPhoneNumbers() {
        // 有效的手机号
        assertTrue(ValidationUtil.isValidPhone("13800138000"));
        assertTrue(ValidationUtil.isValidPhone("15912345678"));
        assertTrue(ValidationUtil.isValidPhone("18888888888"));
        assertTrue(ValidationUtil.isValidPhone("19900001111"));
        assertTrue(ValidationUtil.isValidPhone("17700007777"));
    }

    @Test
    public void testIsValidPhone_nullOrEmptyShouldReturnTrue() {
        // 空值应该返回true（允许为空）
        assertTrue(ValidationUtil.isValidPhone(null));
        assertTrue(ValidationUtil.isValidPhone(""));
    }

    @Test
    public void testIsValidPhone_invalidPhoneNumbers() {
        // 无效的手机号
        assertFalse(ValidationUtil.isValidPhone("12345678901")); // 第二位不能是2
        assertFalse(ValidationUtil.isValidPhone("10000000000")); // 第二位不能是0
        assertFalse(ValidationUtil.isValidPhone("1380013800"));  // 少一位
        assertFalse(ValidationUtil.isValidPhone("138001380001")); // 多一位
        assertFalse(ValidationUtil.isValidPhone("23800138000")); // 不是1开头
        assertFalse(ValidationUtil.isValidPhone("1380013800a")); // 包含字母
        assertFalse(ValidationUtil.isValidPhone("138-0013-8000")); // 包含特殊字符
        assertFalse(ValidationUtil.isValidPhone("138 0013 8000")); // 包含空格
    }

    // ========== validatePhone 测试 ==========

    @Test
    public void testValidatePhone_validPhoneShouldNotThrow() {
        // 有效手机号不应抛出异常
        ValidationUtil.validatePhone("13800138000", "手机号");
        ValidationUtil.validatePhone(null, "手机号");
        ValidationUtil.validatePhone("", "手机号");
    }

    @Test(expected = IllegalArgumentException.class)
    public void testValidatePhone_invalidPhoneShouldThrow() {
        ValidationUtil.validatePhone("12345", "手机号");
    }

    @Test
    public void testValidatePhone_exceptionMessageContainsFieldName() {
        try {
            ValidationUtil.validatePhone("invalid", "联系电话");
            fail("Should throw IllegalArgumentException");
        } catch (IllegalArgumentException e) {
            assertTrue(e.getMessage().contains("联系电话"));
        }
    }
}
