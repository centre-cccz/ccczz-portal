-- ============================================================================
-- EVENT SYSTEM AUDIT TABLES
-- ============================================================================
-- Database initialization script for event management system
-- This script adds audit tables for tracking all event changes

USE ccclezoo_db;

-- ============================================================================
-- EVENT AUDIT TABLE
-- ============================================================================
-- Tracks every action performed on events for compliance and debugging
-- ============================================================================

CREATE TABLE IF NOT EXISTS event_audit (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Event identification
    event_id VARCHAR(100) NOT NULL,
    event_title VARCHAR(255),
    
    -- Action tracking
    action VARCHAR(50) NOT NULL,          -- create, update, validate, publish, cancel, delete, restore
    action_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- User information
    triggered_by VARCHAR(100),             -- user_id or 'system' or 'job_worker'
    user_role VARCHAR(50),                 -- ROLE_DG, ROLE_DACPA, ROLE_DF, ROLE_DA, ROLE_SYSTEM
    user_direction VARCHAR(100),           -- Direction of the user who triggered action
    
    -- Change tracking
    old_status VARCHAR(50),                -- draft, validated, published, cancelled, archived
    new_status VARCHAR(50),
    old_value JSON,                        -- Full previous state
    new_value JSON,                        -- Full new state
    
    -- Context
    direction_context VARCHAR(100),        -- Direction responsible for event
    change_summary VARCHAR(500),           -- Human-readable summary
    
    -- System tracking
    webhook_triggered BOOLEAN DEFAULT FALSE,  -- Were webhooks triggered?
    webhook_ids JSON,                      -- Which webhooks fired
    
    ip_address VARCHAR(45),                -- Source IP (if from API)
    user_agent VARCHAR(255),               -- User agent
    
    -- Indexing
    INDEX idx_event_id (event_id),
    INDEX idx_action (action),
    INDEX idx_timestamp (action_timestamp),
    INDEX idx_triggered_by (triggered_by),
    INDEX idx_status_change (old_status, new_status),
    INDEX idx_direction (direction_context),
    FULLTEXT INDEX ft_summary (change_summary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- WEBHOOK LOGS TABLE
-- ============================================================================
-- Detailed logging of webhook delivery attempts
-- Useful for debugging and tracking webhook health
-- ============================================================================

CREATE TABLE IF NOT EXISTS webhook_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Webhook identification
    webhook_id VARCHAR(100) NOT NULL,
    webhook_url VARCHAR(500),
    
    -- Event trigger context
    event_type VARCHAR(100),               -- event.created, event.published, etc.
    event_id VARCHAR(100),
    event_title VARCHAR(255),
    
    -- Request details
    request_id VARCHAR(100),
    payload_size INT,                      -- Size of JSON payload in bytes
    request_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Response details
    http_status INT,                       -- HTTP response code received
    response_size INT,                     -- Response body size
    response_time_ms INT,                  -- Milliseconds to complete
    response_body TEXT,                    -- First 1000 chars of response
    
    -- Retry tracking
    retry_count INT DEFAULT 0,
    retry_after_timestamp DATETIME,        -- When to retry (if failed)
    is_success BOOLEAN,
    error_message VARCHAR(500),
    
    -- Status tracking
    status ENUM('pending', 'delivered', 'failed', 'retrying', 'archived') DEFAULT 'pending',
    
    -- Indexing
    INDEX idx_webhook_id (webhook_id),
    INDEX idx_event_type (event_type),
    INDEX idx_timestamp (request_timestamp),
    INDEX idx_status (status),
    INDEX idx_event_id (event_id),
    INDEX idx_http_status (http_status),
    INDEX idx_is_success (is_success)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- JOB QUEUE LOGS TABLE
-- ============================================================================
-- Tracks execution of background jobs (reminders, archiving, etc.)
-- For monitoring and debugging job worker health
-- ============================================================================

CREATE TABLE IF NOT EXISTS job_queue_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Job identification
    job_id VARCHAR(100) NOT NULL UNIQUE,
    job_name VARCHAR(100),                 -- send_reminders, archive_events, generate_report
    
    -- Execution details
    started_at DATETIME,
    completed_at DATETIME,
    execution_time_ms INT,                 -- Total execution time in milliseconds
    
    -- Processing context
    total_items INT,                       -- Number of items processed
    successful_items INT,                  -- Successfully processed
    failed_items INT,                      -- Failed items
    
    -- Status tracking
    status ENUM('pending', 'running', 'success', 'partial_failure', 'failed') DEFAULT 'pending',
    error_message TEXT,                    -- Error details if failed
    
    -- Retry information
    attempt INT DEFAULT 1,
    max_attempts INT DEFAULT 3,
    next_retry_at DATETIME,
    
    -- Job parameters
    parameters JSON,                       -- Job-specific parameters
    result JSON,                           -- Job execution results/summary
    
    -- Indexing
    INDEX idx_job_id (job_id),
    INDEX idx_job_name (job_name),
    INDEX idx_status (status),
    INDEX idx_created_at (started_at),
    INDEX idx_failed (failed_items)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- WEBHOOK REGISTRY TABLE
-- ============================================================================
-- Central registry of all webhooks configured in the system
-- ============================================================================

CREATE TABLE IF NOT EXISTS webhooks (
    id VARCHAR(100) PRIMARY KEY,
    
    -- Webhook identification
    name VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(500) NOT NULL,
    
    -- Event triggers
    event_types JSON,                      -- Array of event types to subscribe to
    
    -- Configuration
    is_active BOOLEAN DEFAULT TRUE,
    headers JSON,                          -- Custom headers to send with webhook
    retry_strategy JSON,                   -- Retry config: {maxRetries: 3, delay: 1000}
    timeout_ms INT DEFAULT 10000,
    
    -- Authentication
    auth_type ENUM('none', 'basic', 'bearer', 'api_key') DEFAULT 'none',
    auth_config JSON,                      -- Encrypted auth details
    
    -- Tracking
    created_by VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    direction_context VARCHAR(100),        -- Which direction owns this webhook
    
    -- Statistics
    total_deliveries INT DEFAULT 0,
    successful_deliveries INT DEFAULT 0,
    failed_deliveries INT DEFAULT 0,
    last_attempt_at DATETIME,
    last_success_at DATETIME,
    
    -- Indexing
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at),
    INDEX idx_direction (direction_context),
    UNIQUE KEY uk_url_events (url(255), event_types(100))
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- EVENT CACHE METADATA TABLE
-- ============================================================================
-- Tracks what's cached in Redis for event-related data
-- Helps manage cache invalidation
-- ============================================================================

CREATE TABLE IF NOT EXISTS cache_metadata (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    cache_key VARCHAR(255) UNIQUE NOT NULL,
    cache_type VARCHAR(50),                -- 'event', 'event_list', 'event_count'
    
    -- Related entity
    entity_type VARCHAR(50),               -- 'event', 'direction'
    entity_id VARCHAR(100),
    
    -- Cache status
    is_valid BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,                   -- TTL expiration
    invalidated_at DATETIME,               -- When was cache invalidated
    
    -- Impact tracking
    depends_on JSON,                       -- Other cache keys it depends on
    invalidates JSON,                      -- Other cache keys to invalidate on change
    
    -- Indexing
    INDEX idx_cache_key (cache_key),
    INDEX idx_is_valid (is_valid),
    INDEX idx_expires_at (expires_at),
    INDEX idx_entity (entity_type, entity_id)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- API AUDIT LOG TABLE
-- ============================================================================
-- Audit all API calls for security and compliance
-- Automatically pruned to keep only recent entries
-- ============================================================================

CREATE TABLE IF NOT EXISTS api_audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Request identification
    request_id VARCHAR(100),
    api_endpoint VARCHAR(255),
    
    -- HTTP details
    http_method VARCHAR(10),
    http_status INT,
    response_time_ms INT,
    
    -- User context
    user_id VARCHAR(100),
    user_role VARCHAR(50),
    direction VARCHAR(100),
    
    -- Request/Response
    request_body_hash VARCHAR(64),         -- SHA256 hash to avoid storing sensitive data
    response_body_hash VARCHAR(64),
    
    -- Timestamp
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexing
    INDEX idx_endpoint (api_endpoint),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_http_status (http_status),
    INDEX idx_request_id (request_id)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- AUTO-CLEANUP MAINTENANCE EVENTS
-- ============================================================================
-- These events automatically clean up old audit logs to maintain performance

CREATE EVENT IF NOT EXISTS cleanup_old_api_logs
ON SCHEDULE EVERY 1 DAY
DO
  DELETE FROM api_audit_log 
  WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);

CREATE EVENT IF NOT EXISTS cleanup_old_webhook_logs
ON SCHEDULE EVERY 1 DAY
DO
  DELETE FROM webhook_logs 
  WHERE request_timestamp < DATE_SUB(NOW(), INTERVAL 30 DAY)
  AND status IN ('archived', 'delivered');

CREATE EVENT IF NOT EXISTS cleanup_old_job_logs
ON SCHEDULE EVERY 1 DAY
DO
  DELETE FROM job_queue_logs 
  WHERE completed_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
  AND status IN ('success', 'failed');

CREATE EVENT IF NOT EXISTS cleanup_expired_cache
ON SCHEDULE EVERY 6 HOUR
DO
  DELETE FROM cache_metadata 
  WHERE expires_at < NOW()
  OR (is_valid = FALSE AND invalidated_at < DATE_SUB(NOW(), INTERVAL 1 DAY));

-- ============================================================================
-- SUMMARY VIEWS FOR DASHBOARDS
-- ============================================================================

-- Recent event changes
CREATE OR REPLACE VIEW v_event_changes_recent AS
SELECT 
    ea.event_id,
    ea.event_title,
    ea.action,
    ea.old_status,
    ea.new_status,
    ea.triggered_by,
    ea.user_role,
    ea.action_timestamp,
    ea.direction_context,
    COUNT(wl.id) as webhooks_triggered
FROM event_audit ea
LEFT JOIN webhook_logs wl ON wl.event_id = ea.event_id AND wl.event_type = CONCAT('event.', ea.action)
WHERE ea.action_timestamp > DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY ea.id
ORDER BY ea.action_timestamp DESC;

-- Webhook health summary
CREATE OR REPLACE VIEW v_webhook_health AS
SELECT 
    w.id,
    w.name,
    w.url,
    w.is_active,
    COUNT(wl.id) as total_attempts,
    SUM(CASE WHEN wl.is_success = TRUE THEN 1 ELSE 0 END) as successful,
    SUM(CASE WHEN wl.is_success = FALSE THEN 1 ELSE 0 END) as failed,
    ROUND(SUM(CASE WHEN wl.is_success = TRUE THEN 1 ELSE 0 END) * 100.0 / COUNT(wl.id), 2) as success_rate,
    w.last_success_at,
    MAX(wl.request_timestamp) as last_attempt
FROM webhooks w
LEFT JOIN webhook_logs wl ON w.id = wl.webhook_id
WHERE w.is_active = TRUE
GROUP BY w.id
ORDER BY success_rate ASC;

-- Job queue health summary
CREATE OR REPLACE VIEW v_job_health AS
SELECT 
    job_name,
    COUNT(*) as total_jobs,
    SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful,
    SUM(CASE WHEN status IN ('failed', 'partial_failure') THEN 1 ELSE 0 END) as failed,
    ROUND(SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as success_rate,
    AVG(execution_time_ms) as avg_execution_ms,
    MAX(completed_at) as last_run
FROM job_queue_logs
WHERE started_at > DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY job_name
ORDER BY success_rate ASC;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================
-- Adjust these grants based on your application's database user

GRANT SELECT, INSERT, UPDATE ON ccclezoo_db.event_audit TO 'ccclezoo_user'@'%';
GRANT SELECT, INSERT, UPDATE ON ccclezoo_db.webhook_logs TO 'ccclezoo_user'@'%';
GRANT SELECT, INSERT, UPDATE ON ccclezoo_db.job_queue_logs TO 'ccclezoo_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON ccclezoo_db.webhooks TO 'ccclezoo_user'@'%';
GRANT SELECT, INSERT, DELETE ON ccclezoo_db.cache_metadata TO 'ccclezoo_user'@'%';
GRANT SELECT, INSERT ON ccclezoo_db.api_audit_log TO 'ccclezoo_user'@'%';

GRANT SELECT ON ccclezoo_db.v_event_changes_recent TO 'ccclezoo_user'@'%';
GRANT SELECT ON ccclezoo_db.v_webhook_health TO 'ccclezoo_user'@'%';
GRANT SELECT ON ccclezoo_db.v_job_health TO 'ccclezoo_user'@'%';

-- ============================================================================
-- DONE
-- ============================================================================
