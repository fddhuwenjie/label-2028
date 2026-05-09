-- Set character encoding
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Create database
CREATE DATABASE IF NOT EXISTS lost_found DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE lost_found;

-- User table
CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password` VARCHAR(100) NOT NULL,
    `real_name` VARCHAR(50),
    `phone` VARCHAR(20),
    `email` VARCHAR(100),
    `student_id` VARCHAR(50),
    `department` VARCHAR(100),
    `avatar` VARCHAR(255),
    `role` TINYINT DEFAULT 0 COMMENT '0: user, 1: admin',
    `status` TINYINT DEFAULT 1 COMMENT '0: disabled, 1: active',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Item table
CREATE TABLE IF NOT EXISTS `item` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT,
    `category` VARCHAR(50),
    `location` VARCHAR(200),
    `images` TEXT,
    `type` TINYINT NOT NULL COMMENT '0: lost, 1: found',
    `status` TINYINT DEFAULT 0 COMMENT '0: pending, 1: approved, 2: rejected, 3: claimed',
    `contact_name` VARCHAR(50),
    `contact_phone` VARCHAR(20),
    `item_time` DATETIME,
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Message table
CREATE TABLE IF NOT EXISTS `message` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `item_id` BIGINT,
    `sender_id` BIGINT NOT NULL,
    `receiver_id` BIGINT NOT NULL,
    `content` TEXT NOT NULL,
    `is_read` TINYINT DEFAULT 0 COMMENT '0: unread, 1: read',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`sender_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`receiver_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert admin user (password: 123456, encrypted with salt)
-- MD5("123456campus_lost_found_2024") = bbbb2442ba97d12ecbbb5f7c2e88dec6
INSERT INTO `user` (`username`, `password`, `real_name`, `role`, `status`) 
VALUES ('admin', 'bbbb2442ba97d12ecbbb5f7c2e88dec6', '管理员', 1, 1)
ON DUPLICATE KEY UPDATE `username` = `username`;

-- Insert test user (password: 123456, encrypted with salt)
INSERT INTO `user` (`username`, `password`, `real_name`, `phone`, `student_id`, `department`, `role`, `status`) 
VALUES ('testuser', 'bbbb2442ba97d12ecbbb5f7c2e88dec6', '张三', '13800138000', '2024001', '计算机学院', 0, 1)
ON DUPLICATE KEY UPDATE `username` = `username`;

-- Insert sample items
INSERT INTO `item` (`user_id`, `title`, `description`, `category`, `location`, `type`, `status`, `contact_name`, `contact_phone`, `item_time`) VALUES
(2, '丢失iPhone 14手机', '黑色iPhone 14，蓝色手机壳，在图书馆附近丢失', 'Electronics', '图书馆', 0, 1, '张三', '13800138000', '2024-01-15 14:30:00'),
(2, '捡到学生证', '在食堂附近捡到一张学生证', 'Card', '第一食堂', 1, 1, '张三', '13800138000', '2024-01-16 10:00:00'),
(2, '丢失双肩包', '蓝色耐克双肩包，里面有笔记本电脑', 'Bag', '教学楼A栋', 0, 1, '张三', '13800138000', '2024-01-17 09:00:00');
