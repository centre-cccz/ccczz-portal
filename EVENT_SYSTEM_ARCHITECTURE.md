# Architecture Système d'Événements - CCCZ Portal

## Vue d'ensemble

Système d'événements modulaire en 3 couches :

1. **Événements métier** (créations, modifications, publication d'événements)
2. **Système d'événements système** (webhooks, notifications, audit)
3. **Job queue** (tâches asynchrones programmées)

---

## 1. SERVICE EVENT MANAGER (Nouvelle couche)

### Responsabilités

- Gérer le cycle de vie complet des événements (draft → validated → published → archived)
- Déclencher des hooks système à chaque changement
- Logger chaque action pour audit
- Gérer les permissions par direction (RBAC)

### Événements système déclenchés

```
event.created
event.validated
event.published
event.cancelled
event.updated
event.deleted
```

### Structure du service

```
lib/
├── eventManager.ts          # Manager principal
├── eventEmitter.ts          # Émetteur d'événements
├── eventHooks.ts            # Webhooks système
└── eventAudit.ts            # Logs d'audit
```

---

## 2. WEBHOOK SYSTEM (Nouvelle couche)

### Use Cases

| Événement | Action | Cible |
|-----------|--------|-------|
| `event.published` | Envoyer email aux abonnés | Service Email |
| `event.published` | Invalider cache Redis | Cache Layer |
| `event.updated` | Notifier admins | Admin Dashboard |
| `event.cancelled` | Rembourser billets | Service Facturation |
| `event.approaching` | Rappel 7 jours avant | Notification Service |

### Structure

```
app/api/webhooks/
├── register.ts              # Enregistrer webhook
├── trigger.ts               # Déclencher webhooks
└── logs/                     # Historique webhooks
```

---

## 3. JOB QUEUE SYSTEM (Nouvelle couche - Bull/Redis)

### Tâches programmées

| Job | Trigger | Fréquence |
|-----|---------|-----------|
| `event:send-reminders` | 7j, 3j, 1j avant | Quotidien (3h du matin) |
| `event:archive-completed` | Après la date de fin | Quotidien |
| `event:generate-report` | À la demande ou hebdo | Hebdomadaire |
| `cache:refresh-events` | Les premières modifications | À la demande |
| `notification:send-batch` | Lot de notifications en attente | Toutes les heures |

### Structure

```
lib/queues/
├── eventQueue.ts            # Queue des événements
├── notificationQueue.ts      # Queue des notifications
├── jobs/
│   ├── sendReminders.ts
│   ├── archiveEvents.ts
│   └── generateReports.ts
└── workers/                  # Workers (tournent en arrière-plan)
    ├── eventWorker.ts
    └── notificationWorker.ts
```

---

## 4. AUDIT SYSTEM (Amélioration)

### Table d'audit enrichie

```sql
CREATE TABLE event_audit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id VARCHAR(50),
    action VARCHAR(50),           -- create, update, publish, cancel, delete
    triggered_by VARCHAR(50),      -- user_id or 'system'
    user_role VARCHAR(50),         -- ROLE_DG, ROLE_DACPA
    old_value JSON,                -- Valeur avant
    new_value JSON,                -- Valeur après
    direction_context VARCHAR(100), -- Direction responsable
    webhook_triggered BOOLEAN,     -- Hooks déclenché?
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_event_id (event_id),
    INDEX idx_action (action),
    INDEX idx_timestamp (timestamp)
);

CREATE TABLE webhook_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    webhook_id VARCHAR(50),
    event_type VARCHAR(50),
    payload JSON,
    http_status INT,
    response TEXT,
    retry_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_webhook_id (webhook_id),
    INDEX idx_created_at (created_at)
);
```

---

## 5. ARCHITECTURE DOCKER AMÉLIORÉE

### Services additionnels

```yaml
# Services existants : db, cache, api

# Nouveau : Event Queue Worker
event-worker:
  build:
    context: .
    dockerfile: Dockerfile.worker
  environment:
    REDIS_URL: redis://cache:6379
    DB_URL: mysql://DB_USER:DB_PASS@DB_HOST:3306/DB_NAME
  depends_on:
    - cache
    - db
  restart: unless-stopped

# Nouveau : Webhook Service
webhook-service:
  build:
    context: ./services/webhook
    dockerfile: Dockerfile
  environment:
    REDIS_URL: redis://cache:6379
    DB_URL: mysql://DB_USER:DB_PASS@DB_HOST:3306/DB_NAME
  ports:
    - "3001:3000"  # Isolated port
  depends_on:
    - cache
    - db
  restart: unless-stopped

# Nouveau : Notification Service
notification-service:
  build:
    context: ./services/notification
    dockerfile: Dockerfile
  environment:
    REDIS_URL: redis://cache:6379
    SMTP_HOST: ${SMTP_HOST}
    SMTP_KEY: ${SMTP_KEY}
  depends_on:
    - cache
  restart: unless-stopped
```

---

## 6. FLOW COMPLET D'UN NOUVEL ÉVÉNEMENT

```
┌──────────────┐
│ Admin crée   │ → POST /api/events/create (ROLE_DACPA)
│ événement    │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│ EventManager.create()     │ Stocke en BD (status: draft)
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Émet event.created       │ Logger audit, valider données
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Admin valide événement   │ → POST /api/events/validate (ROLE_DACPA)
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│ EventManager.validate()                  │
│ - Mets à jour status: validated          │
│ - Émet event.validated                   │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│ DG approuve (ROLE_DG)                    │ → POST /api/events/publish
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│ EventManager.publish()                           │
│ - Mets à jour status: published et posted_at     │
│ - Émet event.published                           │
│ - Invalide cache Redis (cache:refresh-events)    │
└──────┬───────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│ Webhook System déclenche :                        │
│ - Envoyer emails aux abonnés (Job Queue)         │
│ - Mettre à jour la page /evenements              │
│ - Notifier dashboard admins                      │
└──────┬───────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│ Job Queue ajoute les tâches asynchrones :        │
│ - sendEmailNotification (immédiat)               │
│ - scheduleReminders (7j, 3j, 1j avant)           │
│ - archiveAfterEvent (après date fin)             │
└──────────────────────────────────────────────────┘
```

---

## 7. API ENDPOINTS NOUVEAUX

### Événements

```
POST   /api/events/create           # Créer (ROLE_DACPA)
POST   /api/events/[id]/validate    # Valider (ROLE_DACPA)
POST   /api/events/[id]/publish     # Publier (ROLE_DG)
POST   /api/events/[id]/cancel      # Annuler
GET    /api/events/[id]/audit       # Historique complet
GET    /api/events?direction=tech&status=draft
```

### Webhooks

```
POST   /api/webhooks/register       # Enregistrer webhook
GET    /api/webhooks                # Lister webhooks
DELETE /api/webhooks/[id]           # Supprimer webhook
GET    /api/webhooks/[id]/logs      # Logs d'exécution
POST   /api/webhooks/[id]/retry     # Re-déclencher
```

### Jobs

```
GET    /api/jobs                    # Lister jobs en attente
GET    /api/jobs/[id]/status        # Statut job
POST   /api/jobs/[id]/cancel        # Annuler job
GET    /api/jobs/history            # Historique exécution
```

---

## 8. VARIABLES D'ENVIRONNEMENT SUPPLÉMENTAIRES

```bash
# Redis Bull Queue
REDIS_URL=redis://cache:6379
BULL_PREFIX=cccz:queue

# Events
EVENT_MAX_RETRIES=3
EVENT_NOTIFICATION_DELAY_MS=1000

# Webhooks
WEBHOOK_TIMEOUT=10000
WEBHOOK_MAX_RETRIES=3
WEBHOOK_RETRY_DELAY_MS=5000

# Jobs
JOBS_SEND_REMINDERS_CRON="0 3 * * *"        # 3h du matin
JOBS_ARCHIVE_CRON="0 1 * * *"               # 1h du matin

# Notifications
SMTP_HOST=smtp.provider.com
SMTP_USER=notifications@ccclezoo.cd
SMTP_KEY=key_xyz
NOTIFICATION_FROM=events@cclezoo.cd
```

---

## 9. INSTALLATION & MIGRATION

### Étape 1 : Installer Bull Queue

```bash
npm install bull bull-board dotenv

# Pour PostgreSQL option :
npm install pg
```

### Étape 2 : Créer tables audit

```sql
-- Voir section 4 (SQL inclus)
```

### Étape 3 : Créer les services workers

```
lib/queues/eventQueue.ts
lib/queues/workers/eventWorker.ts
services/webhook/
services/notification/
```

### Étape 4 : Mettre à jour docker-compose.yml

```yaml
# Ajouter event-worker, webhook-service, notification-service
```

### Étape 5 : Déployer progressivement

1. Test local avec Docker Compose
2. Deployment staging
3. Production avec monitoring

---

## 10. MONITORING & OBSERVABILITÉ

### Dashboards à implémenter

- **Bull Board** : Visualiser queues et jobs
- **Event Audit Board** : Timeline des actions
- **Webhook Monitor** : Taux succès/erreurs
- **Performance** : Latence pub/sub

### Métriques clés

```
- Events created/published/cancelled par direction
- Temps moyen publication (draft → published)
- Taux erreurs webhooks
- Latence job queue (max 10s)
- Cache hit rate Redis (cible: >90%)
```

---

## 11. ROADMAP IMPLÉMENTATION

| Phase | Durée | Tâches |
|-------|-------|--------|
| **Phase 1** | 3j | Audit system + EventManager + EventEmitter |
| **Phase 2** | 4j | Bull Queue + Jobs workers |
| **Phase 3** | 3j | Webhook system + Service isolation |
| **Phase 4** | 2j | Notification service (Email/SMS) |
| **Phase 5** | 2j | Monitoring + Bull Board + Tests |
| **Phase 6** | 2j | Documentation + Training |

---

## Avantages de cette architecture

✅ **Scalabilité** : Services découplés, workers dans containers séparés  
✅ **Fiabilité** : Retry automatique, audit complet, healthchecks  
✅ **Observabilité** : Logs centralisés, trace complète des changements  
✅ **Maintenabilité** : Code organisé, responsabilités claires  
✅ **Conformité** : RBAC respecté, traçabilité institutionnelle  
✅ **Performance** : Cache intelligent, notifications asynchrones  
