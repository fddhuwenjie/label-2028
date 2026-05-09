package com.campus.lostfound.util;

import org.apache.commons.codec.digest.DigestUtils;

public class PasswordUtil {
    
    private static final String SALT = "campus_lost_found_2024";

    public static String encrypt(String password) {
        return DigestUtils.md5Hex(password + SALT);
    }

    public static boolean verify(String password, String encryptedPassword) {
        return encrypt(password).equals(encryptedPassword);
    }
}
