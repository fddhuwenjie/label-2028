package com.campus.lostfound.common;

import org.junit.Test;
import static org.junit.Assert.*;

/**
 * Result 响应类单元测试
 */
public class ResultTest {

    @Test
    public void testSuccess_withData() {
        String data = "test data";
        Result<String> result = Result.success(data);
        
        assertEquals(Integer.valueOf(0), result.getCode());
        assertEquals("成功", result.getMessage());
        assertEquals(data, result.getData());
    }

    @Test
    public void testSuccess_withNullData() {
        Result<Object> result = Result.success(null);
        
        assertEquals(Integer.valueOf(0), result.getCode());
        assertNull(result.getData());
    }

    @Test
    public void testError_withMessage() {
        String errorMessage = "Something went wrong";
        Result<Object> result = Result.error(errorMessage);
        
        assertNotEquals(Integer.valueOf(0), result.getCode());
        assertEquals(errorMessage, result.getMessage());
        assertNull(result.getData());
    }

    @Test
    public void testError_withCodeAndMessage() {
        int errorCode = 1001;
        String errorMessage = "Custom error";
        Result<Object> result = Result.error(errorCode, errorMessage);
        
        assertEquals(Integer.valueOf(errorCode), result.getCode());
        assertEquals(errorMessage, result.getMessage());
    }
}
