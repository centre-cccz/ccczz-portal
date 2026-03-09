# 📊 Diagrammes d'Architecture - Système d'Événements CCCZ

## 1. Vue d'ensemble de la nouvelle architecture

```mermaid
graph TB
    subgraph "Admin Interface"
        A1["🔐 Admin Portal"]
        A2["📊 Audit Dashboard"]
        A3["🔗 Webhook Dashboard"]
        A4["📦 Bull Board Queue Monitor"]
    end
    
    subgraph "API Layer"
        API["🚀 API Next.js (3000)"]
        EM["⚙️ EventManager"]
        EE["📣 EventEmitter"]
        EH["🪝 EventHooks"]
        EA["📋 EventAudit"]
    end
    
    subgraph "Queue & Jobs"
        Q1["📬 eventQueue"]
        Q2["📬 notificationQueue"]
        Q3["📬 webhookQueue"]
    end
    
    subgraph "Background Workers"
        W1["👷 Event Worker<br/>- Reminders<br/>- Archive"]
        W2["👷 Webhook Service<br/>- Deliver<br/>- Retry"]
        W3["👷 Notification Service<br/>- Email<br/>- SMS"]
    end
    
    subgraph "Data & Cache"
        DB["🗄️ MySQL<br/>event_audit<br/>webhooks<br/>job_queue_logs"]
        REDIS["⚡ Redis Cache<br/>Queue Storage"]
    end
    
    subgraph "External"
        EXT1["📧 SMTP"]
        EXT2["📶 SMS Provider"]
        EXT3["🔗 External Webhooks"]
    end
    
    A1 --> API
    A2 --> DB
    A3 --> DB
    A4 --> REDIS
    
    API --> EM
    EM --> EE
    EE --> EA
    EE --> EH
    
    EE --> Q1
    EE --> Q2
    EE --> Q3
    
    Q1 --> W1
    Q2 --> W3
    Q3 --> W2
    
    EM --> DB
    EA --> DB
    EH --> DB
    
    Q1 --> REDIS
    Q2 --> REDIS
    Q3 --> REDIS
    
    W1 --> DB
    W2 --> DB
    W3 --> DB
    
    W3 --> EXT1
    W3 --> EXT2
    W2 --> EXT3
    
    W1 --> W3
    
    style API fill:#4A90E2
    style EM fill:#7ED321
    style EE fill:#7ED321
    style W1 fill:#F5A623
    style W2 fill:#F5A623
    style W3 fill:#F5A623
    style DB fill:#9013FE
    style REDIS fill:#FF0073
```

---

## 2. Flux de création d'événement (Publication)

```mermaid
sequenceDiagram
    participant Admin as 👤 Admin CCCZ
    participant API as 🚀 API (3000)
    participant EM as ⚙️ EventManager
    participant DB as 🗄️ MySQL
    participant EE as 📣 EventEmitter
    participant QUE as 📬 Queue Redis
    participant WORK as 👷 Workers
    participant SMTP as 📧 SMTP
    participant WH as 🔗 Webhooks
    
    Admin->>API: POST /events/create
    API->>EM: create(eventData)
    EM->>DB: INSERT event (status=draft)
    DB-->>EM: event_id
    EM->>EE: emit('event.created')
    
    EE->>DB: INSERT event_audit
    EE->>QUE: add job: schedule-reminders
    EE->>QUE: add job: notify-stakeholders
    
    API-->>Admin: ✅ Response (50ms)
    
    par Async Jobs
        QUE->>WORK: Process schedule-reminders
        WORK->>DB: Add reminder jobs (7d, 3d, 1d)
        QUE->>WORK: Process notify-stakeholders
        WORK->>SMTP: Enqueue notifications
        WORK->>WH: Trigger webhooks
    end
    
    WORK->>SMTP: Send emails async
    SMTP-->>WORK: Delivery confirmed
    WORK->>WH: POST to external webhooks
    WH-->>WORK: 200 OK
    
    note over Admin,QUE: Admin gets response in 50ms<br/>while background jobs continue
```

---

## 3. Cycle de validation d'événement

```mermaid
state "Event Lifecycle" as EL {
    
    [*] --> DRAFT: Admin creates
    
    DRAFT: status=draft<br/>created_at=now<br/>created_by=user_id
    
    DRAFT --> VALIDATED: ROLE_DACPA validates
    
    VALIDATED: validated_at=now<br/>validated_by=user_id<br/>Audit logged
    
    VALIDATED --> PUBLISHED: ROLE_DG approves
    
    PUBLISHED: published_at=now<br/>posted_by=user_id<br/>Webhooks triggered<br/>Notifications sent<br/>Cache invalidated
    
    VALIDATED --> DRAFT: ROLE_DACPA rejects
    
    PUBLISHED --> CANCELLED: Admin cancels
    CANCELLED: cancelled_at=now<br/>Notifications sent<br/>Webhook triggered
    
    CANCELLED --> [*]
    PUBLISHED --> [*]: Auto-archived<br/>after end_date
    
    state PUBLISHED {
        [*] --> ACTIVE: Event ongoing
        ACTIVE --> ENDED: After end_date
    }
}
```

---

## 4. Architecture de webhook et retry

```mermaid
graph LR
    subgraph "Webhook Flow"
        EE["📣 EventEmitter<br/>event.published"]
        EH["🪝 EventHooks<br/>triggerHooks()"]
        WQ["📬 Webhook Queue<br/>Bull + Redis"]
        
        WS["👷 Webhook Service<br/>(Port 3001)"]
        WD["📤 Webhook Deliverer<br/>- HTTP client<br/>- Timeout handling<br/>- HMAC signing"]
        
        RETRY["🔄 Retry Logic<br/>Attempt 1: Immediate<br/>Attempt 2: +5s delay<br/>Attempt 3: +25s delay"]
        
        WL["📋 Webhook Logs<br/>event_id, status<br/>http_code, response"]
        
        EXT["🌐 External Service<br/>Receives webhook"]
    end
    
    EE --> EH
    EH --> WQ
    WQ --> WS
    WS --> WD
    WD --> EXT
    
    EXT -->|200-299| WL
    EXT -->|4xx-5xx| RETRY
    RETRY -->|Retry| WD
    RETRY -->|Max retries| WL
    
    WL -->|Failed| DB[(🗄️ webhook_logs)]
    WL -->|Success| DB
    
    style EE fill:#4A90E2
    style EH fill:#7ED321
    style WQ fill:#FF0073
    style WS fill:#F5A623
    style WD fill:#F5A623
    style RETRY fill:#FF0073
    style WL fill:#9013FE
```

---

## 5. Job Queue Architecture

```mermaid
graph TB
    subgraph "Job Scheduling"
        CRON1["⏰ CRON 0 3 * * *<br/>Send Reminders"]
        CRON2["⏰ CRON 0 1 * * *<br/>Archive Events"]
        CRON3["⏰ CRON 0 0 * * 0<br/>Generate Reports"]
        
        CRON1 --> Q["📬 Redis Queue<br/>Bull Queue Storage"]
        CRON2 --> Q
        CRON3 --> Q
    end
    
    subgraph "Job Processing"
        WORKER["👷 Event Worker<br/>services/workers/eventWorker.ts"]
        Q --> WORKER
        
        JOB1["🔔 sendRemindersJob<br/>- Find events 7/3/1d from now<br/>- Create notification jobs"]
        JOB2["📦 archiveEventJob<br/>- Find ended events<br/>- Mark as archived"]
        JOB3["📊 reportJob<br/>- Aggregate statistics<br/>- Send to admin"]
        
        WORKER --> JOB1
        WORKER --> JOB2
        WORKER --> JOB3
    end
    
    subgraph "Execution Tracking"
        JOB1 --> LOG1["✅ Attempt 1: Success"]
        JOB1 --> RET1["❌ Attempt 1: Failed<br/>🔄 Retry with backoff"]
        
        JOB2 --> LOG2["✅ event_worker_1 processed"]
        JOB3 --> LOG3["📊 Report generated"]
        
        LOG1 --> DB[(🗄️ job_queue_logs)]
        LOG2 --> DB
        LOG3 --> DB
        RET1 --> DB
    end
    
    subgraph "Monitoring"
        DB --> BOARD["📊 Bull Board<br/>localhost:3003"]
        DB --> DASH["📈 Admin Dashboard<br/>Job health metrics"]
    end
    
    style CRON1 fill:#FF6B6B
    style CRON2 fill:#FF6B6B
    style CRON3 fill:#FF6B6B
    style WORKER fill:#F5A623
    style JOB1 fill:#7ED321
    style JOB2 fill:#7ED321
    style JOB3 fill:#7ED321
    style BOARD fill:#4A90E2
    style DASH fill:#4A90E2
```

---

## 6. Email Notification Pipeline

```mermaid
graph LR
    subgraph "Trigger"
        EE["📃 event.published<br/>EventEmitter"]
    end
    
    subgraph "Queue"
        NQ["📬 notificationQueue<br/>Bull + Redis"]
        JOB["📧 Email Job<br/>{to, template, data}"]
    end
    
    subgraph "Worker"
        NW["👷 Notification Worker<br/>services/notifications/"]
        BATCH["🔄 Batch Processor<br/>Max 50 emails/batch<br/>1s delay between"]
    end
    
    subgraph "Template Rendering"
        TMPL["📋 Template Engine<br/>Handlebars"]
        T1["📧 event-published.hbs"]
        T2["📧 event-reminder-7d.hbs"]
        T3["📧 event-cancelled.hbs"]
    end
    
    subgraph "Delivery"
        SMTP["📤 SMTP Client<br/>nodemailer"]
        PROVIDER["🌐 Email Provider<br/>Gmail, SendGrid, etc."]
    end
    
    subgraph "Logging"
        LOG["📋 Email Logs<br/>status, response<br/>delivery_time"]
    end
    
    EE --> NQ
    NQ --> JOB
    JOB --> NW
    NW --> BATCH
    BATCH --> TMPL
    
    TMPL --> T1
    TMPL --> T2
    TMPL --> T3
    
    BATCH --> SMTP
    SMTP --> PROVIDER
    PROVIDER --> LOG
    
    LOG --> DB[(🗄️ Email History)]
    
    style EE fill:#4A90E2
    style NQ fill:#FF0073
    style NW fill:#F5A623
    style SMTP fill:#7ED321
    style LOG fill:#9013FE
```

---

## 7. Docker Compose Services

```mermaid
graph TB
    subgraph "Docker Network (cccz_network)"
        subgraph "Data Layer"
            DB["🗄️ db<br/>MySQL 8.0:3306<br/>cccz_db"]
            CACHE["⚡ cache<br/>Redis 7:6379<br/>Bull Queue + Cache"]
        end
        
        subgraph "API & Web"
            API["🚀 api:3000<br/>Next.js App<br/>EventManager<br/>API Endpoints"]
        end
        
        subgraph "Background Services"
            WORKER["👷 event-worker<br/>Bull Worker<br/>Job Processing"]
            WEBHOOK["🪝 webhook-service:3001<br/>Webhook Delivery<br/>Retry Logic"]
            NOTIFY["📧 notification-service:3002<br/>Email/SMS<br/>Template Rendering"]
        end
        
        subgraph "Monitoring"
            BOARD["📊 bull-board:3003<br/>Queue Monitoring<br/>Dashboard"]
        end
        
        REDIS["REDIS_VOLUME<br/>cache_data"]
        MYSQL["MYSQL_VOLUME<br/>db_data"]
    end
    
    subgraph "External"
        SMTP["📤 SMTP<br/>Email Provider"]
        SMS["📶 SMS Provider<br/>Twilio, etc."]
        WHHOOK["🔗 Webhooks<br/>External Services"]
    end
    
    API --> DB
    API --> CACHE
    
    WORKER --> DB
    WORKER --> CACHE
    
    WEBHOOK --> DB
    WEBHOOK --> CACHE
    
    NOTIFY --> CACHE
    NOTIFY --> SMTP
    NOTIFY --> SMS
    
    WEBHOOK --> WHHOOK
    
    BOARD --> CACHE
    BOARD --> API
    BOARD --> WORKER
    
    CACHE --> REDIS
    DB --> MYSQL
    
    style DB fill:#9013FE
    style CACHE fill:#FF0073
    style API fill:#4A90E2
    style WORKER fill:#F5A623
    style WEBHOOK fill:#F5A623
    style NOTIFY fill:#F5A623
    style BOARD fill:#7ED321
```

---

## 8. Database Schema Relationships

```mermaid
erDiagram
    EVENT ||--o{ EVENT_AUDIT : triggers
    EVENT ||--o{ JOB_QUEUE_LOGS : schedules
    EVENT ||--o{ CACHE_METADATA : invalidates
    
    WEBHOOKS ||--o{ WEBHOOK_LOGS : delivers
    EVENT ||--o{ WEBHOOK_LOGS : triggers
    
    API_AUDIT_LOG ||--o{ EVENT : relates_to
    JOB_QUEUE_LOGS ||--o{ WEBHOOK_LOGS : triggers
    
    EVENT {
        VARCHAR event_id PK
        VARCHAR title
        VARCHAR status "draft|validated|published|cancelled|archived"
        DATETIME created_at
        VARCHAR created_by FK
        VARCHAR direction_owner FK
    }
    
    EVENT_AUDIT {
        BIGINT id PK
        VARCHAR event_id FK
        VARCHAR action "create|validate|publish|cancel|delete"
        VARCHAR triggered_by
        VARCHAR user_role
        DATETIME action_timestamp
        JSON old_value
        JSON new_value
    }
    
    WEBHOOKS {
        VARCHAR id PK
        VARCHAR name
        VARCHAR url
        JSON event_types
        BOOLEAN is_active
        DATETIME created_at
    }
    
    WEBHOOK_LOGS {
        BIGINT id PK
        VARCHAR webhook_id FK
        VARCHAR event_type
        INT http_status
        ENUM status "pending|delivered|failed|retrying"
        DATETIME request_timestamp
    }
    
    JOB_QUEUE_LOGS {
        BIGINT id PK
        VARCHAR job_id
        VARCHAR job_name "send_reminders|archive_events"
        ENUM status "pending|running|success|failed"
        DATETIME started_at
        INT execution_time_ms
    }
    
    API_AUDIT_LOG {
        BIGINT id PK
        VARCHAR api_endpoint
        VARCHAR user_id FK
        INT http_status
        DATETIME created_at
    }
    
    CACHE_METADATA {
        INT id PK
        VARCHAR cache_key
        BOOLEAN is_valid
        DATETIME expires_at
    }
```

---

## 9. Comparaison latence avant/après

```mermaid
gantt
    title API Response Time Comparison
    
    section Before (File-based)
    Parse JSON file :a1, 0, 50ms
    Validate event :a2, after a1, 30ms
    Write file :a3, after a2, 100ms
    Write history :a4, after a3, 50ms
    Total (BLOCKING) :crit, a1, 230ms
    
    section After (DB+Queue)
    DB Insert :b1, 0, 20ms
    Emit event :b2, after b1, 10ms
    Enqueue jobs :b3, after b2, 20ms
    Response :crit, b1, 50ms
    
    section Background (Async)
    Process jobs :c1, 50ms, 500ms
    Send webhooks :c2, 50ms, 800ms
    Send emails :c3, 50ms, 2000ms
```

---

## 10. Monitoring Dashboard Views

```mermaid
graph TB
    subgraph "Admin Dashboard (3000/admin)"
        D1["📊 Audit Timeline<br/>See all event changes"]
        D2["🪝 Webhook Health<br/>Success rate chart"]
        D3["📦 Job Monitor<br/>Queue status"]
        D4["🔍 Compliance Report<br/>GDPR audit trail"]
    end
    
    subgraph "Bull Board (3003)"
        BB1["Active Jobs"]
        BB2["Completed Jobs"]
        BB3["Failed Jobs"]
        BB4["Queue Performance"]
    end
    
    subgraph "Health Checks"
        HC1["GET /health"]
        HC2["GET /api/events/audit"]
        HC3["GET /api/webhooks/health"]
        HC4["GET /api/jobs/status"]
    end
    
    D1 --> DB[(🗄️ event_audit)]
    D2 --> DB
    D3 --> DB
    D4 --> DB
    
    BB1 --> REDIS[(⚡ Redis)]
    BB2 --> REDIS
    BB3 --> REDIS
    BB4 --> REDIS
    
    HC1 --> API
    HC2 --> DB
    HC3 --> DB
    HC4 --> DB
    
    style D1 fill:#4A90E2
    style D2 fill:#4A90E2
    style D3 fill:#4A90E2
    style D4 fill:#4A90E2
    style BB1 fill:#7ED321
    style BB2 fill:#7ED321
    style BB3 fill:#7ED321
    style BB4 fill:#7ED321
```

---

## Légende des icônes

| Icône | Signification |
|-------|---------------|
| 🚀 | API/Server |
| 🗄️ | Base de données |
| ⚡ | Cache/Redis |
| 📬 | Queue job |
| 👷 | Worker process |
| 📣 | Event emitter |
| 🪝 | Webhook |
| 📧 | Email/Notification |
| 📊 | Dashboard/Monitoring |
| 🔐 | Authentication |
| 🌐 | External service |
| ⏰ | Scheduler/Cron |
| 📋 | Logs/Audit |
| ✅ | Success |
| ❌ | Error/Failure |
| 🔄 | Retry/Loop |
