package com.campus.lostfound.util;

import org.junit.Test;
import static org.junit.Assert.*;

/**
 * PasswordUtil 单元测试
 */
public class PasswordUtilTest {

    @Test
    public void testEncrypt_shouldReturnConsistentHash() {
        String password = "test123";
        String encrypted1 = PasswordUtil.encrypt(password);
        String encrypted2 = PasswordUtil.encrypt(password);
        
        assertNotNull(encrypted1);
        assertEquals(encrypted1, encrypted2);
    }

    @Test
    public void testEncrypt_differentPasswordsShouldProduceDifferentHashes() {
        String password1 = "password1";
        String password2 = "password2";
        
        String encrypted1 = PasswordUtil.encrypt(password1);
        String encrypted2 = PasswordUtil.encrypt(password2);
        
        assertNotEquals(encrypted1, encrypted2);
    }

    @Test
    public void testVerify_correctPasswordShouldReturnTrue() {
        String password = "mySecurePassword";
        String encrypted = PasswordUtil.encrypt(password);
        
        assertTrue(PasswordUtil.verify(password, encrypted));
    }

    @Test
    public void testVerify_wrongPasswordShouldReturnFalse() {
        String password = "correctPassword";
        String wrongPassword = "wrongPassword";
        String encrypted = PasswordUtil.encrypt(password);
        
        assertFalse(PasswordUtil.verify(wrongPassword, encrypted));
    }

    @Test
    public void testEncrypt_emptyPasswordShouldWork() {
        String password = "";
        String encrypted = PasswordUtil.encrypt(password);
        
        assertNotNull(encrypted);
        assertTrue(PasswordUtil.verify(password, encrypted));
    }

    @Test
    public void testEncrypt_specialCharactersShouldWork() {
        String password = "p@$$w0rd!#%^&*()";
        String encrypted = PasswordUtil.encrypt(password);
        
        assertNotNull(encrypted);
        assertTrue(PasswordUtil.verify(password, encrypted));
    }

    @Test
    public void testEncrypt_chineseCharactersShouldWork() {
        String password = "密码测试123";
        String encrypted = PasswordUtil.encrypt(password);
        
        assertNotNull(encrypted);
        assertTrue(PasswordUtil.verify(password, encrypted));
    }
}
