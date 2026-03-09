# 🔍 REQUÊTES SQL COURANTES — CCCZ

**Document**: Exemples de Requêtes Pratiques  
**Version**: 1.0 — Février 2026  

---

## TABLE DES MATIÈRES

1. [Gouvernance & Users](#gouvernance--users)
2. [Contenu Public](#contenu-public)
3. [Gestion Interne](#gestion-interne)
4. [Billetterie & Finances](#billetterie--finances)
5. [Audit & Monitoring](#audit--monitoring)
6. [Rapports & KPIs](#rapports--kpis)

---

## GOUVERNANCE & USERS

### Lister tous les utilisateurs actifs avec leurs rôles

```sql
SELECT 
  u.id,
  u.email,
  u.full_name,
  d.name as direction,
  r.name as role,
  udm.assigned_at
FROM users u
LEFT JOIN user_direction_mappings udm ON u.id = udm.user_id
LEFT JOIN directions d ON udm.direction_id = d.id
LEFT JOIN roles r ON udm.role_id = r.id
WHERE u.is_active = TRUE
ORDER BY d.name, r.name;
```

### Créer un nouvel utilisateur DACPA

```sql
-- 1. Insérer utilisateur
INSERT INTO users (email, password_hash, full_name, is_active)
VALUES ('artist@ccclezoo.cd', '$2b$10$HASH_HERE', 'Artist Name', TRUE);

-- 2. Assigner à direction DACPA avec rôle ROLE_DACPA
INSERT INTO user_direction_mappings (user_id, direction_id, role_id, assigned_at, assigned_by_user_id)
SELECT 
  (SELECT id FROM users WHERE email = 'artist@ccclezoo.cd'),
  (SELECT id FROM directions WHERE code = 'DACPA'),
  (SELECT id FROM roles WHERE name = 'ROLE_DACPA'),
  NOW(),
  (SELECT id FROM users WHERE email = 'admin@ccclezoo.cd');
```

### Vérifier permissions utilisateur

```sql
SELECT 
  u.email,
  r.name as role,
  p.resource,
  p.action,
  p.conditions_json
FROM users u
JOIN user_direction_mappings udm ON u.id = udm.user_id
JOIN roles r ON udm.role_id = r.id
LEFT JOIN permissions p ON r.id = p.role_id
WHERE u.email = 'director@dacpa.cd';
```

### Révoquer accès utilisateur

```sql
-- Soft delete (désactiver)
UPDATE users 
SET is_active = FALSE 
WHERE email = 'former_staff@ccclezoo.cd';

-- Audit
INSERT INTO audit_history (entity_type, entity_id, action, performed_by, new_values)
VALUES ('users', (SELECT id FROM users WHERE email = 'former_staff@ccclezoo.cd'), 
        'DISABLE', (SELECT id FROM users WHERE email = 'admin@ccclezoo.cd'),
        JSON_OBJECT('is_active', false));
```

### Lister directions & stats

```sql
SELECT 
  d.id,
  d.code,
  d.name,
  COUNT(DISTINCT udm.user_id) as staff_count,
  COUNT(DISTINCT ei.id) as events_internal,
  COUNT(DISTINCT as.id) as artist_submissions
FROM directions d
LEFT JOIN user_direction_mappings udm ON d.id = udm.direction_id
LEFT JOIN events_internal ei ON d.id = ei.direction_owner
LEFT JOIN artist_submissions as ON d.id = as.direction_owner
WHERE d.is_active = TRUE
GROUP BY d.id
ORDER BY d.name;
```

---

## CONTENU PUBLIC

### Charger événements publiés (Page Public)

```sql
-- Événements à venir (public)
SELECT 
  pe.id,
  pe.title,
  pe.slug,
  pe.description,
  pe.start_date,
  pe.end_date,
  pe.location,
  ec.name as category,
  pe.image_url
FROM public_events pe
LEFT JOIN event_categories ec ON pe.category_id = ec.id
WHERE pe.is_visible = TRUE 
  AND pe.start_date >= NOW()
  AND pe.published_at <= NOW()
ORDER BY pe.start_date ASC
LIMIT 20;
```

### Détail d'un événement + billets disponibles

```sql
SELECT 
  pe.id,
  pe.title,
  pe.description,
  pe.start_date,
  pe.end_date,
  pe.location,
  pe.image_url,
  t.id as ticket_id,
  t.ticket_type,
  t.quantity_available,
  t.quantity_sold,
  t.current_price,
  (t.quantity_available - t.quantity_sold) as remaining
FROM public_events pe
LEFT JOIN tickets t ON pe.id = t.event_id
WHERE pe.slug = 'concert-jazz-octobre-2026'
  AND pe.is_visible = TRUE;
```

### Lister actualités récentes

```sql
SELECT 
  id,
  title,
  excerpt,
  author,
  published_at,
  image_url,
  slug
FROM public_news
WHERE is_visible = TRUE
  AND published_at <= NOW()
ORDER BY published_at DESC
LIMIT 10;
```

### Galeries publiques

```sql
SELECT 
  id,
  title,
  description,
  type,
  media_url,
  thumbnail_url,
  published_at
FROM public_galleries
WHERE is_visible = TRUE
  AND type = 'photo'
ORDER BY published_at DESC;
```

### Espaces disponibles

```sql
SELECT 
  ps.id,
  ps.name,
  ps.type,
  ps.capacity,
  ps.description,
  ps.image_url,
  ps.amenities_json
FROM public_spaces ps
WHERE ps.is_visible = TRUE
ORDER BY ps.name ASC;
```

### Artistes reconnus

```sql
SELECT 
  id,
  name,
  specialization,
  biography,
  image_url,
  website_url
FROM public_artists
WHERE is_visible = TRUE
ORDER BY name ASC;
```

### Subscribers newsletter

```sql
SELECT 
  id,
  email,
  subscribed_at,
  preferences_json
FROM newsletter_subscribers
WHERE unsubscribed_at IS NULL
ORDER BY subscribed_at DESC;
```

---

## GESTION INTERNE

### Brouillons d'événements à valider (DACPA)

```sql
SELECT 
  ei.id,
  ei.title,
  ei.state,
  ei.created_by as creator_id,
  u.full_name as creator_name,
  ei.direction_owner,
  d.name as direction,
  ei.created_at
FROM events_internal ei
JOIN users u ON ei.created_by = u.id
JOIN directions d ON ei.direction_owner = d.id
WHERE ei.state = 'DRAFT'
  AND ei.direction_owner = (SELECT id FROM directions WHERE code = 'DACPA')
ORDER BY ei.created_at DESC;
```

### Créer événement interne (DACPA)

```sql
INSERT INTO events_internal 
  (title, description, start_date, end_date, location, category_id, 
   created_by, direction_owner, state)
VALUES 
  ('Concert Jazz Novembre',
   'Concert jazz avec artiste congolais',
   '2026-11-15 19:00:00',
   '2026-11-15 22:00:00',
   'Salle Principale',
   (SELECT id FROM event_categories WHERE name = 'Concert'),
   (SELECT id FROM users WHERE email = 'dacpa@ccclezoo.cd'),
   (SELECT id FROM directions WHERE code = 'DACPA'),
   'DRAFT');

-- Log audit
INSERT INTO audit_history (entity_type, entity_id, action, performed_by, new_values)
VALUES ('events_internal', LAST_INSERT_ID(), 'CREATE', 
        (SELECT id FROM users WHERE email = 'dacpa@ccclezoo.cd'),
        JSON_OBJECT('title', 'Concert Jazz Novembre', 'state', 'DRAFT'));
```

### Soumettre événement pour validation

```sql
-- Mise à jour état
UPDATE events_internal 
SET state = 'EN_REVIEW'
WHERE id = 1;

-- Créer validation record
INSERT INTO event_validations 
  (event_id, validation_state_id, created_at)
SELECT 
  1,
  (SELECT id FROM validation_states WHERE name = 'EN_REVIEW'),
  NOW();
```

### Approuver événement (DG)

```sql
-- Approuver
UPDATE events_internal 
SET state = 'APPROVED'
WHERE id = 1;

-- Log validation
UPDATE event_validations 
SET validation_state_id = (SELECT id FROM validation_states WHERE name = 'APPROVED'),
    validated_by = (SELECT id FROM users WHERE email = 'dg@ccclezoo.cd'),
    validated_at = NOW(),
    comments = 'Approuvé pour publication'
WHERE event_id = 1;
```

### Publier événement (copier vers public)

```sql
-- Insérer événement public
INSERT INTO public_events 
  (title, slug, description, start_date, end_date, location, category_id, image_url, 
   published_at, is_visible)
SELECT 
  title,
  LOWER(REPLACE(REPLACE(title, ' ', '-'), 'é', 'e')),
  description,
  start_date,
  end_date,
  location,
  category_id,
  image_url,
  NOW(),
  TRUE
FROM events_internal 
WHERE id = 1;

-- Audit
INSERT INTO audit_history (entity_type, entity_id, action, performed_by, new_values)
VALUES ('public_events', LAST_INSERT_ID(), 'PUBLISH', 
        (SELECT id FROM users WHERE email = 'dg@ccclezoo.cd'),
        JSON_OBJECT('from', 'events_internal:1', 'is_visible', true));
```

### Candidatures artistes en attente

```sql
SELECT 
  as.id,
  as.artist_name,
  as.email,
  as.specialization,
  as.submission_date,
  as.status,
  d.name as direction_owner,
  u.full_name as reviewed_by
FROM artist_submissions as
JOIN directions d ON as.direction_owner = d.id
LEFT JOIN users u ON as.reviewed_by = u.id
WHERE as.status = 'PENDING'
ORDER BY as.submission_date ASC;
```

### Approuver artiste candidature

```sql
-- 1. Créer artiste public
INSERT INTO public_artists 
  (name, slug, biography, specialization, image_url)
SELECT 
  artist_name,
  LOWER(REPLACE(artist_name, ' ', '-')),
  biography,
  specialization,
  CONCAT('https://ccclezoo.cd/artists/', LOWER(REPLACE(artist_name, ' ', '-')), '.jpg')
FROM artist_submissions 
WHERE id = 1;

-- 2. Marquer candidature approuvée
UPDATE artist_submissions 
SET status = 'APPROVED',
    reviewed_by = (SELECT id FROM users WHERE email = 'dacpa@ccclezoo.cd'),
    reviewed_at = NOW()
WHERE id = 1;

-- 3. Log audit
INSERT INTO audit_history (entity_type, entity_id, action, performed_by, new_values)
VALUES ('artist_submissions', 1, 'APPROVE', 
        (SELECT id FROM users WHERE email = 'dacpa@ccclezoo.cd'),
        JSON_OBJECT('status', 'APPROVED'));
```

---

## BILLETTERIE & FINANCES

### Créer tickets pour événement

```sql
INSERT INTO tickets 
  (event_id, ticket_type, quantity_available, base_price, current_price)
VALUES 
  (1, 'Standard', 100, 25.00, 25.00),
  (1, 'Réduit (Etudiant)', 30, 15.00, 15.00),
  (1, 'VIP', 10, 50.00, 50.00);
```

### Afficher tarifs & promotions

```sql
SELECT 
  pr.id,
  pe.title as event,
  pr.ticket_type,
  pr.base_price,
  pr.discount_percent,
  pr.reduced_price,
  pr.valid_from,
  pr.valid_to
FROM pricing_rules pr
JOIN public_events pe ON pr.event_id = pe.id
WHERE pr.valid_from <= NOW() 
  AND pr.valid_to >= NOW()
ORDER BY pr.valid_from;
```

### Statistiques ventes tickets

```sql
SELECT 
  t.ticket_type,
  COUNT(tr.id) as tickets_sold,
  t.base_price,
  SUM(tr.amount_paid) as total_revenue,
  AVG(tr.amount_paid) as avg_price,
  COUNT(DISTINCT tr.processed_by) as sellers
FROM tickets t
LEFT JOIN transactions tr ON t.id = tr.ticket_id AND tr.status = 'COMPLETED'
WHERE t.event_id = 1
GROUP BY t.ticket_type, t.base_price;
```

### Factures par direction

```sql
SELECT 
  i.id,
  i.invoice_number,
  d.name as direction,
  i.total_amount,
  i.issued_date,
  i.paid_date,
  CASE WHEN i.paid_date IS NULL THEN 'UNPAID' ELSE 'PAID' END as status
FROM invoices i
JOIN directions d ON i.direction_id = d.id
WHERE YEAR(i.issued_date) = YEAR(NOW())
ORDER BY i.issued_date DESC;
```

### Enregistrer transaction paiement

```sql
-- Créer transaction
INSERT INTO transactions 
  (ticket_id, amount_paid, payment_method, payment_date, processed_by, status, reference_number)
VALUES 
  (1, 25.00, 'CARD', NOW(), 
   (SELECT id FROM users WHERE email = 'seller@ccclezoo.cd'),
   'COMPLETED',
   'TXN-' || DATE_FORMAT(NOW(), '%Y%m%d') || '-' || MD5(RAND()));

-- Log audit
INSERT INTO audit_history (entity_type, entity_id, action, performed_by, new_values)
VALUES ('transactions', LAST_INSERT_ID(), 'CREATE', 
        (SELECT id FROM users WHERE email = 'seller@ccclezoo.cd'),
        JSON_OBJECT('status', 'COMPLETED', 'amount', 25.00));
```

### Générer rapport revenue par période & direction

```sql
SELECT 
  d.name as direction,
  DATE(t.payment_date) as date,
  COUNT(DISTINCT t.id) as transaction_count,
  SUM(t.amount_paid) as total_revenue,
  AVG(t.amount_paid) as avg_transaction
FROM transactions t
JOIN tickets tk ON t.ticket_id = tk.id
JOIN public_events pe ON tk.event_id = pe.id
JOIN directions d ON pe.category_id IS NOT NULL  -- Ou via internal event owner
WHERE t.status = 'COMPLETED'
  AND DATE(t.payment_date) BETWEEN '2026-01-01' AND '2026-12-31'
GROUP BY d.id, DATE(t.payment_date)
ORDER BY date DESC, direction;
```

### Créer & sauvegarder rapport revenue

```sql
INSERT INTO revenue_reports 
  (period_start, period_end, direction_id, total_revenue, ticket_count, 
   transaction_count, generated_by, generated_at)
SELECT 
  DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-1 DAY) as period_start,
  LAST_DAY(CURDATE()) as period_end,
  d.id as direction_id,
  COALESCE(SUM(t.amount_paid), 0) as total_revenue,
  COUNT(DISTINCT t.ticket_id) as ticket_count,
  COUNT(DISTINCT t.id) as transaction_count,
  (SELECT id FROM users WHERE email = 'finance@ccclezoo.cd'),
  NOW()
FROM directions d
LEFT JOIN transactions t ON DATE(t.payment_date) BETWEEN 
  DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-1 DAY) 
  AND LAST_DAY(CURDATE())
  AND t.status = 'COMPLETED'
WHERE d.is_active = TRUE
GROUP BY d.id;
```

---

## AUDIT & MONITORING

### Journal audit complet (derniers 100 événements)

```sql
SELECT 
  ah.id,
  ah.entity_type,
  ah.entity_id,
  ah.action,
  u.full_name as performed_by,
  ah.created_at,
  ah.ip_address,
  ah.old_values,
  ah.new_values
FROM audit_history ah
LEFT JOIN users u ON ah.performed_by = u.id
ORDER BY ah.created_at DESC
LIMIT 100;
```

### Audit par entité spécifique

```sql
SELECT 
  ah.action,
  ah.performed_by,
  u.full_name,
  ah.created_at,
  ah.old_values,
  ah.new_values
FROM audit_history ah
LEFT JOIN users u ON ah.performed_by = u.id
WHERE ah.entity_type = 'events_internal' 
  AND ah.entity_id = '1'
ORDER BY ah.created_at DESC;
```

### Activité utilisateur

```sql
SELECT 
  u.email,
  u.full_name,
  COUNT(ah.id) as action_count,
  MAX(ah.created_at) as last_action
FROM audit_history ah
JOIN users u ON ah.performed_by = u.id
WHERE DATE(ah.created_at) = CURDATE()
GROUP BY u.id
ORDER BY action_count DESC;
```

### Validation workflow history

```sql
SELECT 
  vw.entity_type,
  vw.entity_id,
  vs.name as current_state,
  u.full_name as initiated_by,
  vw.initiated_at,
  vw.completed_at,
  vw.workflow_path_json
FROM validations_workflow vw
JOIN validation_states vs ON vw.current_state = vs.name
JOIN users u ON vw.initiated_by = u.id
WHERE vw.entity_type = 'events_internal'
ORDER BY vw.initiated_at DESC;
```

### Modifications par table (change log)

```sql
SELECT 
  cl.table_name,
  COUNT(cl.id) as change_count,
  cl.change_type,
  u.full_name as changed_by
FROM change_log cl
LEFT JOIN users u ON cl.changed_by = u.id
WHERE DATE(cl.changed_at) BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()
GROUP BY cl.table_name, cl.change_type, u.id
ORDER BY change_count DESC;
```

---

## RAPPORTS & KPIs

### Résumé activité (Dashboard)

```sql
SELECT 
  'Utilisateurs actifs' as metric,
  COUNT(DISTINCT u.id) as value
FROM users u
WHERE u.is_active = TRUE

UNION ALL

SELECT 'Événements publiés', COUNT(*) 
FROM public_events WHERE is_visible = TRUE

UNION ALL

SELECT 'Candidatures artistes en attente', COUNT(*) 
FROM artist_submissions WHERE status = 'PENDING'

UNION ALL

SELECT 'Tickets vendus ce mois', COUNT(DISTINCT t.id)
FROM transactions t 
WHERE MONTH(t.payment_date) = MONTH(NOW())
  AND t.status = 'COMPLETED'

UNION ALL

SELECT 'Revenue ce mois (CDF)', SUM(t.amount_paid)
FROM transactions t
WHERE MONTH(t.payment_date) = MONTH(NOW())
  AND t.status = 'COMPLETED';
```

### Top événements (par inscriptions)

```sql
SELECT 
  pe.title,
  COUNT(DISTINCT er.id) as registrations,
  COUNT(DISTINCT t.id) as tickets_sold,
  SUM(tr.amount_paid) as revenue
FROM public_events pe
LEFT JOIN event_registrations er ON pe.id = er.event_id
LEFT JOIN tickets t ON pe.id = t.event_id
LEFT JOIN transactions tr ON t.id = tr.ticket_id AND tr.status = 'COMPLETED'
GROUP BY pe.id
ORDER BY registrations DESC
LIMIT 10;
```

### Taux acceptation candidatures artistes (par direction)

```sql
SELECT 
  d.name as direction,
  COUNT(CASE WHEN as.status = 'APPROVED' THEN 1 END) as approved,
  COUNT(CASE WHEN as.status = 'REJECTED' THEN 1 END) as rejected,
  COUNT(as.id) as total_submissions,
  ROUND(100.0 * COUNT(CASE WHEN as.status = 'APPROVED' THEN 1 END) / 
        COUNT(as.id), 2) as approval_rate_percent
FROM artist_submissions as
JOIN directions d ON as.direction_owner = d.id
GROUP BY d.id
ORDER BY approval_rate_percent DESC;
```

### Croissance abonnés newsletter

```sql
SELECT 
  DATE_TRUNC(DATE(subscribed_at), MONTH) as month,
  COUNT(DISTINCT id) as new_subscribers,
  (SELECT COUNT(*) FROM newsletter_subscribers 
   WHERE unsubscribed_at IS NULL 
   AND DATE(subscribed_at) <= DATE_TRUNC(DATE(subscribed_at), MONTH)) as cumulative
FROM newsletter_subscribers
GROUP BY YEAR(subscribed_at), MONTH(subscribed_at)
ORDER BY month DESC;
```

---

**Document approuvé par**: Agent Architecte Backend & Data CCCZ  
**Date**: Février 2026
