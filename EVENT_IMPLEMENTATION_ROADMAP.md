# Implémentation du Système d'Événements CCCZ

## 📋 Checklist d'implémentation par phase

### Phase 1 : Foundation (3-4 jours)

Infrastructure de base du système d'audit et d'événements

- [ ] **1.1** Exécuter le script SQL `db/event_system_audit.sql` en BD
  - Creates: 6 tables + 3 vues + 4 événements de cleanup
  - Verify: `SHOW TABLES LIKE 'event_%'` retourne 6 tables
  
- [ ] **1.2** Créer le module `lib/eventManager.ts`
  - Exporte: `EventManager` class avec méthodes CRUD
  - Méthodes: `create()`, `validate()`, `publish()`, `cancel()`, `delete()`
  - Chaque méthode appelle `eventEmitter.emit()`

- [ ] **1.3** Créer `lib/eventEmitter.ts`
  - Extend `EventEmitter` from Node.js
  - Subscribes aux événements: `event.created`, `event.validated`, etc.
  - Logs chaque événement dans `event_audit`

- [ ] **1.4** Créer `lib/eventAudit.ts`
  - Helper functions pour logger les changements
  - `logAction()`, `getDiff()`, `getAuditTrail()`
  - Enrichit données avec IP, user agent, etc.

- [ ] **1.5** Mettre à jour `app/api/events/route.ts`
  - Importer `EventManager` et remplacer logique fichier
  - Tout passe par EventManager → BD au lieu de fichier JSON
  - Tests unitaires pour chaque action (create, validate, publish)

---

### Phase 2: Job Queue (3-4 jours)

Système de tâches asynchrones avec Bull + Redis

- [ ] **2.1** Installer les dépendances

  ```bash
  npm install bull bull-board
  ```

- [ ] **2.2** Créer `lib/queues/eventQueue.ts`
  - Exporte instance Bull Queue
  - Connecte à Redis via env var `BULL_REDIS_URL`
  - Processe les tâches avec retry strategy

- [ ] **2.3** Créer les job files

  ```
  lib/queues/jobs/
  ├── sendReminderJob.ts       # Send email reminders 7/3/1 days before
  ├── archiveEventJob.ts       # Archive completed events
  ├── generateReportJob.ts     # Weekly/monthly reports
  └── cacheRefreshJob.ts       # Invalidate Redis cache on changes
  ```

- [ ] **2.4** Créer `services/workers/eventWorker.ts`
  - Standalone Node process que le container lance
  - Écoute `eventQueue` et exécute les jobs
  - Avec logging et error handling

- [ ] **2.5** Scheduler des tâches récurrentes

  ```typescript
  // Dans eventWorker.ts
  queue.add('send-reminders', {}, {
    repeat: { cron: process.env.JOBS_SEND_REMINDERS_CRON }
  });
  ```

- [ ] **2.6** Tests
  - Mock Redis, vérifier que jobs s'ajoutent à queue
  - Tester failures et retries

---

### Phase 3: Webhook System (3-4 jours)

Système de webhooks pour événements système

- [ ] **3.1** Créer `lib/eventHooks.ts`
  - Hook registry : quels hooks se déclenchent sur quels événements
  - `registerHook()`, `triggerHooks()`, `unregisterHook()`

- [ ] **3.2** Créer `app/api/webhooks/` endpoints

  ```
  app/api/webhooks/
  ├── route.ts          # GET (list), POST (register)
  ├── [id]/
  │   ├── route.ts      # GET, PATCH, DELETE
  │   ├── logs/
  │   │   └── route.ts  # GET webhook logs/history
  │   └── retry/
  │       └── route.ts  # POST to manually retry failed deliveries
  └── trigger/
      └── route.ts      # POST to manually trigger webhook (test)
  ```

- [ ] **3.3** Créer microservice webhook isolated

  ```
  services/webhook/
  ├── Dockerfile
  ├── package.json
  ├── src/
  │   ├── server.ts          # Express server
  │   ├── deliverer.ts       # HTTP client + retries
  │   ├── worker.ts          # Bull worker for webhook jobs
  │   └── models.ts          # Webhook data models
  ```

- [ ] **3.4** Intégrer webhooks avec EventManager

  ```typescript
  // Dans eventEmitter
  eventEmitter.on('event.published', async (event) => {
    await eventHooks.trigger('event.published', event);
  });
  ```

- [ ] **3.5** Tests
  - Mock webhook URLs (use webhook.site ou similar)
  - Vérifier retry logic, timeout handling
  - Vérifier que logs enregistrent tous les attempts

---

### Phase 4: Notifications (2-3 jours)

Service centralisé pour emails, SMS, push

- [ ] **4.1** Créer microservice notifications

  ```
  services/notifications/
  ├── Dockerfile
  ├── package.json
  ├── src/
  │   ├── server.ts           # Express server
  │   ├── email/
  │   │   ├── templates/      # Handlebars templates
  │   │   │   ├── event-reminder.hbs
  │   │   │   ├── event-published.hbs
  │   │   │   └── event-cancelled.hbs
  │   │   └── sender.ts       # SMTP client (nodemailer)
  │   ├── notification-queue.ts # Bull queue
  │   └── worker.ts           # Email delivery worker
  ```

- [ ] **4.2** Email templates
  - Event reminder (7j, 3j, 1j avant)
  - Event published notification
  - Event cancelled notification
  - Bilingue FR/EN si requis

- [ ] **4.3** Intégrer avec webhook système

  ```typescript
  // Dans webhook trigger
  if (eventType === 'event.published') {
    notificationQueue.add('send-email', {
      to: subscribers,
      template: 'event-published',
      data: event
    });
  }
  ```

- [ ] **4.4** Tests
  - Test email delivery (use Mailtrap ou similaire)
  - Vérifier templates rendering
  - Batch vs individual sends

---

### Phase 5: Monitoring (2-3 jours)

Dashboards et observabilité

- [ ] **5.1** Bull Board setup

  ```
  services/bull-board/
  ├── Dockerfile
  ├── package.json
  └── src/server.ts
  ```

  - Dashboard accessible sur `http://localhost:3003`
  - Monitor queues: eventQueue, notificationQueue, webhookQueue

- [ ] **5.2** Audit Dashboard

  ```
  app/admin/audit/
  ├── page.tsx           # Vue d'ensemble audit
  ├── events/            # Filtrer par événement
  ├── webhooks/          # Santé webhooks
  ├── jobs/              # Santé job queue
  └── api-logs/          # API audit logs
  ```

- [ ] **5.3** Logs & Monitoring
  - Configurer logging centralisé (Winston ou Bunyan)
  - Exporter métriques (Prometheus format optionnel)
  - Setup alertes pour erreurs critiques

- [ ] **5.4** Health checks
  - `/health` endpoint pour chaque service
  - Check: DB, Redis, queues, webhooks
  - Articles de santé sur dashboards

---

### Phase 6: Testing & Documentation (2-3 jours)

- [ ] **6.1** Tests unitaires

  ```
  __tests__/
  ├── eventManager.test.ts
  ├── eventEmitter.test.ts
  ├── eventHooks.test.ts
  ├── jobs/
  ├── webhooks/
  └── integrations/
  ```

- [ ] **6.2** Tests d'intégration
  - End-to-end: create event → validate → publish → webhooks fired
  - Docker Compose local test
  - Scenarios: success, failures, retries

- [ ] **6.3** Load testing
  - Bulk create events
  - Concurrent webhooks
  - Job queue performance

- [ ] **6.4** Documentation
  - Pour devs: API docs, architecture diagrams
  - Pour ops: Troubleshooting guide, monitoring
  - Pour admins: User guide des webhooks

---

## 🚀 Déploiement

### Local Development

```bash
# Utiliser docker-compose.yml original
docker-compose up -d

# Ajouter event worker une fois implémenté
docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d event-worker
```

### Staging

```bash
docker-compose -f docker-compose.prod.yml up -d --build

# Vérifier tous les services
docker-compose -f docker-compose.prod.yml ps

# Vérifier santé
curl http://localhost:3000/health       # API
curl http://localhost:3001/health       # Webhooks
curl http://localhost:3002/health       # Notifications
curl http://localhost:3003/health       # Bull Board
```

### Production

```bash
# Scale workers si nécessaire
docker-compose -f docker-compose.prod.yml up -d --scale event-worker=2

# Monitoring
docker logs -f cccz_event_worker
docker logs -f cccz_webhook_service
docker logs -f cccz_notification_service
```

---

## 📊 Métriques clés à tracker

| Métrique | Cible | Alerte |
|----------|------|--------|
| Event creation → publish latency | < 30s | > 60s |
| Webhook delivery success rate | > 99% | < 95% |
| Job queue completion time | < 10s | > 30s |
| Redis cache hit rate | > 90% | < 80% |
| DB query time (p99) | < 100ms | > 500ms |
| Event audit log growth/day | < 1000 rows | > 10000 |

---

## 🔒 Sécurité

### Checklist sécurité

- [ ] Webhook URLs validées (no localhost en prod)
- [ ] Auth config encryptée en BD
- [ ] API endpoints protected par RBAC
- [ ] Audit logs immutables (pas d'update/delete)
- [ ] Request signing pour webhooks (HMAC)
- [ ] Rate limiting sur API événements
- [ ] Secrets dans .env (jamais commitées)

---

## 📝 Prochaines étapes immédiates

1. **Créer les branches** pour chaque phase

   ```bash
   git checkout -b feature/event-system-phase-1
   ```

2. **Configurer CI/CD** pour tester les phases
   - GitHub Actions with Docker Compose
   - Test scripts pour chaque phase

3. **Estimer effort** par personne/équipe
   - Phase 1-2 peut être parallèle
   - Phase 3 dépend de 1-2
   - Phase 4 peut être parallèle

---

## ✅ Validation pour chaque phase

### Phase 1 ✓

```sql
-- Vérifier tables créées
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'ccclezoo_db' AND TABLE_NAME LIKE 'event_%';
-- Doit retourner: event_audit, webhook_logs, job_queue_logs, webhooks, cache_metadata, api_audit_log

-- Tester audit log
INSERT INTO event_audit (event_id, event_title, action, triggered_by) 
VALUES ('test_123', 'Test Event', 'create', 'user_001');
SELECT * FROM event_audit WHERE event_id = 'test_123';
```

### Phase 2 ✓

```bash
# Tester queue
npm test -- __tests__/eventManager.test.ts

# Tester worker
npm run worker:dev &
# Trigger test event et vérifier logs
```

### Phase 3 ✓

```bash
# Tester webhooks
POST http://localhost:3000/api/webhooks/register \
  -H "Content-Type: application/json" \
  -d '{"name":"test","url":"https://webhook.site/...","events":["event.published"]}'

# Vérifier logs
GET http://localhost:3001/api/webhook-logs
```

### Phase 4 ✓

```bash
# Vérifier email envoyé
npm test -- services/notifications/__tests__/email.test.ts

# Check logs
docker logs cccz_notification_service | grep "email sent"
```

### Phase 5 ✓

```bash
# Bull Board accessible
open http://localhost:3003

# Audit dashboard accessible
open http://localhost:3000/admin/audit
```

---

## Contacts & Questions

- **Architecture** → Consulter EVENT_SYSTEM_ARCHITECTURE.md
- **Docker** → Vérifier docker-compose.prod.yml
- **DB** → Voir db/event_system_audit.sql
- **API** → GET /api/events/[id]/audit pour audit trail
