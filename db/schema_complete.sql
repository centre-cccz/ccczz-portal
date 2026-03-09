-- Active: 1770479935958@@41.79.235.70@3306
-- ============================================================================
-- CCCZ PORTAL — SCHÉMA COMPLET DE DÉPLOIEMENT
-- ============================================================================
-- Schéma SQL complet pour déploiement cPanel
-- Production-ready avec gouvernance + audit + RBAC
-- 
-- Exécution: mysql -h localhost -u ccclezoo_user -p ccclezoo_db < schema_complete.sql
-- ============================================================================

-- ============================================================================
-- 1. GOUVERNANCE & ACCÈS
-- ============================================================================

CREATE TABLE IF NOT EXISTS `directions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_direction_code` (`code`),
  INDEX `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `roles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `permissions_json` JSON,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_name` (`name`),
  INDEX `idx_role_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(191) NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `last_login_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_email` (`email`),
  INDEX `idx_user_email` (`email`),
  INDEX `idx_user_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_direction_mappings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `direction_id` BIGINT UNSIGNED NOT NULL,
  `role_id` BIGINT UNSIGNED NOT NULL,
  `assigned_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `assigned_by_user_id` BIGINT UNSIGNED NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_direction` (`user_id`, `direction_id`),
  FOREIGN KEY `fk_mapping_user` (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY `fk_mapping_direction` (`direction_id`) REFERENCES `directions` (`id`) ON DELETE CASCADE,
  FOREIGN KEY `fk_mapping_role` (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT,
  FOREIGN KEY `fk_mapping_assigned_by` (`assigned_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_mapping_user` (`user_id`),
  INDEX `idx_mapping_direction` (`direction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `permissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_id` BIGINT UNSIGNED NOT NULL,
  `resource` VARCHAR(100) NOT NULL,
  `action` VARCHAR(50) NOT NULL,
  `conditions_json` JSON,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_permission` (`role_id`, `resource`, `action`),
  FOREIGN KEY `fk_permission_role` (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  INDEX `idx_permission_role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 2. DONNÉES DE RÉFÉRENCE
-- ============================================================================

CREATE TABLE IF NOT EXISTS `event_statuses` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` TEXT,
  `is_published_state` BOOLEAN NOT NULL DEFAULT FALSE,
  `display_order` INT UNSIGNED,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_status_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `validation_states` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` TEXT,
  `order_sequence` INT UNSIGNED,
  `is_terminal_state` BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_validation_state_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `event_categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `icon_url` VARCHAR(255) NULL,
  `display_order` INT UNSIGNED,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_category_name` (`name`),
  INDEX `idx_category_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` JSON,
  `description` TEXT,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by_user_id` BIGINT UNSIGNED NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_setting_key` (`setting_key`),
  FOREIGN KEY `fk_setting_user` (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 3. CONTENU PUBLIC
-- ============================================================================

CREATE TABLE IF NOT EXISTS `public_events` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` LONGTEXT NOT NULL,
  `start_date` DATETIME NOT NULL,
  `end_date` DATETIME NOT NULL,
  `location` VARCHAR(255),
  `category_id` BIGINT UNSIGNED,
  `image_url` VARCHAR(255),
  `published_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_visible` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_event_slug` (`slug`),
  FOREIGN KEY `fk_event_category` (`category_id`) REFERENCES `event_categories` (`id`) ON DELETE SET NULL,
  INDEX `idx_event_published_at` (`published_at`),
  INDEX `idx_event_start_date` (`start_date`),
  INDEX `idx_event_is_visible` (`is_visible`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `public_spaces` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `type` VARCHAR(100),
  `capacity` INT UNSIGNED,
  `description` LONGTEXT,
  `image_url` VARCHAR(255),
  `amenities_json` JSON,
  `published_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_visible` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_space_slug` (`slug`),
  INDEX `idx_space_type` (`type`),
  INDEX `idx_space_visible` (`is_visible`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `public_artists` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `biography` LONGTEXT,
  `specialization` VARCHAR(255),
  `image_url` VARCHAR(255),
  `website_url` VARCHAR(255),
  `published_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_visible` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_artist_slug` (`slug`),
  INDEX `idx_artist_specialization` (`specialization`),
  INDEX `idx_artist_visible` (`is_visible`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `public_news` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `content` LONGTEXT NOT NULL,
  `excerpt` VARCHAR(500),
  `image_url` VARCHAR(255),
  `author` VARCHAR(191),
  `published_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_visible` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_news_slug` (`slug`),
  INDEX `idx_news_published_at` (`published_at`),
  INDEX `idx_news_visible` (`is_visible`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `public_galleries` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT,
  `type` ENUM('photo', 'video', 'document'),
  `media_url` VARCHAR(255) NOT NULL,
  `thumbnail_url` VARCHAR(255),
  `published_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_visible` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_gallery_slug` (`slug`),
  INDEX `idx_gallery_type` (`type`),
  INDEX `idx_gallery_published` (`published_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `subscribed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `unsubscribed_at` TIMESTAMP NULL,
  `preferences_json` JSON,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_subscriber_email` (`email`),
  INDEX `idx_subscriber_active` (`unsubscribed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 4. GESTION INTERNE
-- ============================================================================

CREATE TABLE IF NOT EXISTS `events_internal` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` LONGTEXT,
  `start_date` DATETIME,
  `end_date` DATETIME,
  `location` VARCHAR(255),
  `category_id` BIGINT UNSIGNED,
  `image_url` VARCHAR(255),
  `created_by` BIGINT UNSIGNED NOT NULL,
  `direction_owner` BIGINT UNSIGNED NOT NULL,
  `state` VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY `fk_event_internal_creator` (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  FOREIGN KEY `fk_event_internal_direction` (`direction_owner`) REFERENCES `directions` (`id`) ON DELETE RESTRICT,
  FOREIGN KEY `fk_event_internal_category` (`category_id`) REFERENCES `event_categories` (`id`) ON DELETE SET NULL,
  INDEX `idx_event_internal_state` (`state`),
  INDEX `idx_event_internal_direction` (`direction_owner`),
  INDEX `idx_event_internal_creator` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `event_validations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_id` BIGINT UNSIGNED NOT NULL,
  `validation_state_id` BIGINT UNSIGNED NOT NULL,
  `validated_by` BIGINT UNSIGNED,
  `validated_at` TIMESTAMP NULL,
  `next_reviewer_id` BIGINT UNSIGNED NULL,
  `comments` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY `fk_validation_event` (`event_id`) REFERENCES `events_internal` (`id`) ON DELETE CASCADE,
  FOREIGN KEY `fk_validation_state` (`validation_state_id`) REFERENCES `validation_states` (`id`) ON DELETE RESTRICT,
  FOREIGN KEY `fk_validation_reviewer` (`validated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  FOREIGN KEY `fk_validation_next_reviewer` (`next_reviewer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_validation_event` (`event_id`),
  INDEX `idx_validation_state` (`validation_state_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `artist_submissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `artist_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `biography` LONGTEXT,
  `specialization` VARCHAR(255),
  `portfolio_url` VARCHAR(255),
  `submission_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  `reviewed_by` BIGINT UNSIGNED NULL,
  `reviewed_at` TIMESTAMP NULL,
  `direction_owner` BIGINT UNSIGNED,
  `notes` TEXT,
  PRIMARY KEY (`id`),
  FOREIGN KEY `fk_submission_reviewer` (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  FOREIGN KEY `fk_submission_direction` (`direction_owner`) REFERENCES `directions` (`id`) ON DELETE RESTRICT,
  INDEX `idx_submission_status` (`status`),
  INDEX `idx_submission_date` (`submission_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `project_submissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_title` VARCHAR(255) NOT NULL,
  `description` LONGTEXT,
  `proposed_date` DATETIME,
  `submitted_by_email` VARCHAR(191) NOT NULL,
  `submitted_by_name` VARCHAR(255),
  `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  `submission_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed_by` BIGINT UNSIGNED NULL,
  `reviewed_at` TIMESTAMP NULL,
  `direction_owner` BIGINT UNSIGNED,
  `notes` TEXT,
  PRIMARY KEY (`id`),
  FOREIGN KEY `fk_project_reviewer` (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  FOREIGN KEY `fk_project_direction` (`direction_owner`) REFERENCES `directions` (`id`) ON DELETE RESTRICT,
  INDEX `idx_project_status` (`status`),
  INDEX `idx_project_date` (`submission_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `space_management` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `space_id` BIGINT UNSIGNED NOT NULL,
  `availability_rules_json` JSON,
  `booking_schedule_json` JSON,
  `managed_by` BIGINT UNSIGNED NOT NULL,
  `direction_owner` BIGINT UNSIGNED NOT NULL,
  `last_updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_space_management` (`space_id`),
  FOREIGN KEY `fk_space_management_space` (`space_id`) REFERENCES `public_spaces` (`id`) ON DELETE CASCADE,
  FOREIGN KEY `fk_space_management_user` (`managed_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  FOREIGN KEY `fk_space_management_direction` (`direction_owner`) REFERENCES `directions` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 5. BILLETTERIE & FINANCES
-- ============================================================================

CREATE TABLE IF NOT EXISTS `tickets` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_id` BIGINT UNSIGNED NOT NULL,
  `ticket_type` VARCHAR(100) NOT NULL,
  `quantity_available` INT UNSIGNED NOT NULL,
  `quantity_sold` INT UNSIGNED NOT NULL DEFAULT 0,
  `base_price` DECIMAL(10,2) NOT NULL,
  `current_price` DECIMAL(10,2) NOT NULL,
  `seller_name` VARCHAR(191),
  `sold_at` TIMESTAMP NULL,
  `transaction_id` VARCHAR(255),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY `fk_ticket_event` (`event_id`) REFERENCES `public_events` (`id`) ON DELETE CASCADE,
  INDEX `idx_ticket_event` (`event_id`),
  INDEX `idx_ticket_type` (`ticket_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pricing_rules` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_id` BIGINT UNSIGNED,
  `ticket_type` VARCHAR(100),
  `base_price` DECIMAL(10,2) NOT NULL,
  `discount_percent` DECIMAL(5,2) DEFAULT 0,
  `reduced_price` DECIMAL(10,2),
  `valid_from` DATETIME NOT NULL,
  `valid_to` DATETIME NOT NULL,
  `created_by` BIGINT UNSIGNED,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY `fk_pricing_event` (`event_id`) REFERENCES `public_events` (`id`) ON DELETE SET NULL,
  FOREIGN KEY `fk_pricing_creator` (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_pricing_event` (`event_id`),
  INDEX `idx_pricing_valid` (`valid_from`, `valid_to`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `invoices` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `invoice_number` VARCHAR(50) NOT NULL UNIQUE,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `issued_date` DATETIME NOT NULL,
  `due_date` DATETIME,
  `paid_date` DATETIME NULL,
  `direction_id` BIGINT UNSIGNED NOT NULL,
  `created_by` BIGINT UNSIGNED NOT NULL,
  `notes` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_invoice_number` (`invoice_number`),
  FOREIGN KEY `fk_invoice_direction` (`direction_id`) REFERENCES `directions` (`id`) ON DELETE RESTRICT,
  FOREIGN KEY `fk_invoice_creator` (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  INDEX `idx_invoice_direction` (`direction_id`),
  INDEX `idx_invoice_issued` (`issued_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `transactions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticket_id` BIGINT UNSIGNED NOT NULL,
  `amount_paid` DECIMAL(10,2) NOT NULL,
  `payment_method` VARCHAR(50),
  `payment_date` DATETIME NOT NULL,
  `invoice_id` BIGINT UNSIGNED,
  `processed_by` BIGINT UNSIGNED,
  `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  `reference_number` VARCHAR(255) UNIQUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY `fk_transaction_ticket` (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE RESTRICT,
  FOREIGN KEY `fk_transaction_invoice` (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE SET NULL,
  FOREIGN KEY `fk_transaction_processor` (`processed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_transaction_status` (`status`),
  INDEX `idx_transaction_date` (`payment_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `revenue_reports` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `period_start` DATE NOT NULL,
  `period_end` DATE NOT NULL,
  `direction_id` BIGINT UNSIGNED NOT NULL,
  `total_revenue` DECIMAL(12,2) NOT NULL,
  `ticket_count` INT UNSIGNED NOT NULL,
  `transaction_count` INT UNSIGNED NOT NULL,
  `generated_by` BIGINT UNSIGNED NOT NULL,
  `generated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `report_json` JSON,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_revenue_report` (`direction_id`, `period_start`, `period_end`),
  FOREIGN KEY `fk_revenue_direction` (`direction_id`) REFERENCES `directions` (`id`) ON DELETE RESTRICT,
  FOREIGN KEY `fk_revenue_generator` (`generated_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  INDEX `idx_revenue_period` (`period_start`, `period_end`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 6. COMMUNICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS `contact_forms` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `sender_name` VARCHAR(191) NOT NULL,
  `sender_email` VARCHAR(191) NOT NULL,
  `subject` VARCHAR(255),
  `message` LONGTEXT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'NEW',
  `submitted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `replied_by` BIGINT UNSIGNED NULL,
  `replied_at` TIMESTAMP NULL,
  `ip_address` VARCHAR(45),
  PRIMARY KEY (`id`),
  FOREIGN KEY `fk_contact_form_replier` (`replied_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_contact_status` (`status`),
  INDEX `idx_contact_date` (`submitted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `event_registrations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_id` BIGINT UNSIGNED NOT NULL,
  `participant_name` VARCHAR(191) NOT NULL,
  `participant_email` VARCHAR(191) NOT NULL,
  `registered_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `registration_count` INT UNSIGNED NOT NULL DEFAULT 1,
  `status` VARCHAR(50) NOT NULL DEFAULT 'CONFIRMED',
  `notes` TEXT,
  PRIMARY KEY (`id`),
  FOREIGN KEY `fk_registration_event` (`event_id`) REFERENCES `public_events` (`id`) ON DELETE CASCADE,
  INDEX `idx_registration_event` (`event_id`),
  INDEX `idx_registration_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `artist_applications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `submission_id` BIGINT UNSIGNED NOT NULL,
  `final_status` VARCHAR(50),
  `approval_date` DATETIME NULL,
  `approved_by` BIGINT UNSIGNED NULL,
  `notes` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_application_submission` (`submission_id`),
  FOREIGN KEY `fk_application_submission` (`submission_id`) REFERENCES `artist_submissions` (`id`) ON DELETE CASCADE,
  FOREIGN KEY `fk_application_approver` (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `correspondence` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `contact_form_id` BIGINT UNSIGNED,
  `sender_email` VARCHAR(191) NOT NULL,
  `recipient_email` VARCHAR(191) NOT NULL,
  `message_body` LONGTEXT NOT NULL,
  `sent_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `direction_owner` BIGINT UNSIGNED,
  `email_thread_id` VARCHAR(255),
  PRIMARY KEY (`id`),
  FOREIGN KEY `fk_correspondence_contact` (`contact_form_id`) REFERENCES `contact_forms` (`id`) ON DELETE SET NULL,
  FOREIGN KEY `fk_correspondence_direction` (`direction_owner`) REFERENCES `directions` (`id`) ON DELETE SET NULL,
  INDEX `idx_correspondence_thread` (`email_thread_id`),
  INDEX `idx_correspondence_date` (`sent_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 7. AUDIT & HISTORIQUE
-- ============================================================================

CREATE TABLE IF NOT EXISTS `audit_history` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `entity_type` VARCHAR(100) NOT NULL,
  `entity_id` VARCHAR(191) NOT NULL,
  `action` VARCHAR(50) NOT NULL,
  `performed_by` BIGINT UNSIGNED,
  `old_values` JSON,
  `new_values` JSON,
  `ip_address` VARCHAR(45),
  `user_agent` VARCHAR(255),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY `fk_audit_user` (`performed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_audit_entity` (`entity_type`, `entity_id`),
  INDEX `idx_audit_action` (`action`),
  INDEX `idx_audit_date` (`created_at`),
  INDEX `idx_audit_user` (`performed_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `validations_workflow` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `entity_type` VARCHAR(100) NOT NULL,
  `entity_id` VARCHAR(191) NOT NULL,
  `current_state` VARCHAR(50) NOT NULL,
  `initiated_by` BIGINT UNSIGNED NOT NULL,
  `initiated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` TIMESTAMP NULL,
  `workflow_path_json` JSON,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_workflow` (`entity_type`, `entity_id`),
  FOREIGN KEY `fk_workflow_user` (`initiated_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  INDEX `idx_workflow_state` (`current_state`),
  INDEX `idx_workflow_date` (`initiated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `change_log` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `table_name` VARCHAR(100) NOT NULL,
  `record_id` VARCHAR(191) NOT NULL,
  `change_type` ENUM('INSERT', 'UPDATE', 'DELETE'),
  `changed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `changed_by` BIGINT UNSIGNED,
  `changes_json` JSON,
  PRIMARY KEY (`id`),
  FOREIGN KEY `fk_change_user` (`changed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_change_table_record` (`table_name`, `record_id`),
  INDEX `idx_change_type` (`change_type`),
  INDEX `idx_change_date` (`changed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 8. INSERTION DONNÉES DE RÉFÉRENCE
-- ============================================================================

-- Directions
INSERT INTO `directions` (`code`, `name`, `description`, `is_active`) VALUES
('DG', 'Direction Générale', 'Gouvernance et décisions stratégiques', TRUE),
('DACPA', 'Direction Culture & Programmation', 'Événements, artistes, programmation culturelle', TRUE),
('DF', 'Direction Finances', 'Gestion budgets, revenus, facturations', TRUE),
('DA', 'Direction Administration', 'Ressources humaines, administration', TRUE),
('BIBLIO', 'Direction Bibliothèque', 'Collections, archives, documentaires', TRUE),
('COM', 'Communication', 'Actualités, communication externe', TRUE);

-- Rôles
INSERT INTO `roles` (`name`, `description`, `permissions_json`) VALUES
('ROLE_PUBLIC', 'Utilisateur public (lecture seule)', JSON_OBJECT('read', true, 'write', false)),
('ROLE_DACPA', 'Staff Culture & Programmation', JSON_OBJECT('events', true, 'artists', true, 'read', true, 'write', true)),
('ROLE_FINANCE', 'Staff Finances (billetterie + rapports)', JSON_OBJECT('revenue', true, 'billing', true, 'read', true, 'write', true)),
('ROLE_BIBLIOTHEQUE', 'Staff Bibliothèque (archives)', JSON_OBJECT('archives', true, 'read', true, 'write', true)),
('ROLE_ADMIN', 'Staff Administration (RH + config)', JSON_OBJECT('admin', true, 'read', true, 'write', true, 'users', true)),
('ROLE_DG', 'Direction Générale (accès total)', JSON_OBJECT('read', true, 'write', true, 'admin', true, 'approve', true));

-- Validation States
INSERT INTO `validation_states` (`name`, `description`, `order_sequence`, `is_terminal_state`) VALUES
('DRAFT', 'Brouillon', 1, FALSE),
('EN_REVIEW', 'En révision', 2, FALSE),
('APPROVED', 'Approuvé', 3, FALSE),
('REJECTED', 'Rejeté', 4, FALSE),
('PUBLISHED', 'Publié', 5, TRUE),
('ARCHIVED', 'Archivé', 6, TRUE);

-- Event Categories
INSERT INTO `event_categories` (`name`, `description`, `display_order`) VALUES
('Concert', 'Concerts et performances musicales', 1),
('Exposition', 'Expositions et galeries', 2),
('Atelier', 'Ateliers et formations', 3),
('Conférence', 'Conférences et débats', 4),
('Spectacle', 'Spectacles et performances', 5),
('Cinéma', 'Projections cinématographiques', 6),
('Danse', 'Danse et performances chorégraphiques', 7),
('Littérature', 'Événements littéraires', 8);

-- System Settings
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `description`) VALUES
('app_name', JSON_QUOTE('Centre Culturel Congolais Le Zoo'), 'Nom de l\'application'),
('app_locale', JSON_QUOTE('fr_FR'), 'Locale par défaut'),
('timezone', JSON_QUOTE('Africa/Kinshasa'), 'Fuseau horaire'),
('enable_newsletter', JSON_TRUE(), 'Newsletter activée'),
('enable_ticketing', JSON_TRUE(), 'Billetterie activée');

-- ============================================================================
-- 9. CRÉER UTILISATEUR DEFAULT (admin)
-- ============================================================================

INSERT INTO `users` (`email`, `password_hash`, `full_name`, `is_active`) VALUES
('admin@ccclezoo.cd', '$2b$10$DEFAULT_HASH_CHANGE_ME', 'Administrator CCCZ', TRUE);

-- Assigner admin à DG avec rôle ROLE_DG
INSERT INTO `user_direction_mappings` (`user_id`, `direction_id`, `role_id`, `assigned_at`) 
SELECT 
  u.id, 
  d.id, 
  r.id, 
  NOW()
FROM users u, directions d, roles r
WHERE u.email = 'admin@ccclezoo.cd' 
  AND d.code = 'DG'
  AND r.name = 'ROLE_DG';

-- ============================================================================
-- 10. FIN SCHÉMA
-- ============================================================================

-- ============================================================================
-- DATABASE READY FOR PRODUCTION
-- ================================================================== SELECT 'Database schema deployed successfully! All tables initialized.' AS deployment_status;
