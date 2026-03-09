-- Active: 1770479935958@@41.79.235.70@3306
-- init.sql: create database, user and contacts table
-- NOTE: On cPanel databases and users are often prefixed by your cPanel account (e.g., accountname_ccclezoo_db)

-- Create database (adjust name if cPanel prefixes applied)
CREATE DATABASE IF NOT EXISTS `ccclezoo_portail` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (adjust username and host as needed)
CREATE USER IF NOT EXISTS 'ccclezoo_julio'@'localhost' IDENTIFIED BY 'ChangeMeStrongly!';
GRANT ALL PRIVILEGES ON `ccclezoo_portail`.* TO 'ccclezoo_julio'@'localhost';
FLUSH PRIVILEGES;

-- Create contacts table
USE `ccclezoo_portail`;

CREATE TABLE IF NOT EXISTS `contacts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `message` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add common governance fields for events/projects
-- Note: existing application tables for events/projects should be altered to include these fields.
-- Example migration statements (adjust table names):
-- ALTER TABLE `events` ADD COLUMN `created_by` VARCHAR(191) NULL, ADD COLUMN `validated_by` VARCHAR(191) NULL, ADD COLUMN `direction_owner` VARCHAR(191) NULL;

-- Audit/history table to keep non-deletable records of changes
CREATE TABLE IF NOT EXISTS `audit_history` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `entity_type` VARCHAR(100) NOT NULL,
  `entity_id` VARCHAR(191) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `performed_by` VARCHAR(191) NULL,
  `payload` JSON NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
