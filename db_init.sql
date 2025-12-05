CREATE DATABASE IF NOT EXISTS device_fp_demo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE device_fp_demo;

-- users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- fingerprints table
CREATE TABLE IF NOT EXISTS fingerprints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  signature VARCHAR(128) NOT NULL,
  payload JSON NOT NULL,
  ip VARCHAR(64),
  user_agent TEXT,
  anomaly TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- login_attempts table
CREATE TABLE IF NOT EXISTS login_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  signature VARCHAR(128),
  ip VARCHAR(64),
  username_attempted VARCHAR(100),
  success TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
