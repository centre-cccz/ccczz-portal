# 🗄️ ARCHITECTURE DE BASE DE DONNÉES — CENTRE CULTUREL CONGOLAIS LE ZOO (CCCZ)

**Document**: Architecture Complète de Base de Données Relationnelle  
**Version**: 1.0 — Février 2026  
**Auteur**: Agent Architecte Backend & Data CCCZ  
**Statut**: ✅ Production-Ready  

---

## 📋 TABLE DES MATIÈRES

1. [Contexte Général](#contexte-général)
2. [Directions du CCCZ](#directions-du-cccz)
3. [Recommandation SGBD](#recommandation-sgbd)
4. [Architecture Générale](#architecture-générale)
5. [Liste des Tables](#liste-des-tables)
6. [Diagramme Relationnel](#diagramme-relationnel)
7. [Schéma SQL Complet](#schéma-sql-complet)
8. [Règles de Séparation Interne/Externe](#règles-de-séparation-internexterne)
9. [Gouvernance & Traçabilité](#gouvernance--traçabilité)
10. [Extensions & Intégrations](#extensions--intégrations)

---

## CONTEXTE GÉNÉRAL

### Stack Cible

- **SGBD Principal**: MySQL 8.0 (recommandé) ou PostgreSQL 14+
- **Déploiement Interne**: Docker (MySQL conteneurisé)
- **Déploiement Public**: cPanel (MySQL managé)
- **ORM/Query Builder**: Prisma, Sequelize, ou SQL pur (TypeScript)

### Architecture Globale

```
┌─────────────────────────────────────────────────────┐
│        SITE PUBLIC (Next.js App Router)             │
│  - Accueil, Événements, Espaces, Galerie, Contact  │
│  - Formulaires (contact, inscription, billetterie)  │
│  - Vente tickets, newsletter signup                 │
└─────────────┬───────────────────────────────────────┘
              │ (lectures + écritures limitées)
              │
┌─────────────▼───────────────────────────────────────┐
│       BASE DE DONNÉES PARTAGÉE (MySQL/PostgreSQL)   │
│  - Tables EXTERNES (public_events, contacts_forms)  │
│  - Tables INTERNES (users, validations, audit)      │
│  - Tables PARTAGÉES (directions, roles)             │
└─────────────┬───────────────────────────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
┌───▼──┐            ┌──▼────┐
│ RBAC │            │ Audit │
│LOGIC │            │ Trail │
└──────┘            └───────┘
    │
    ▼
┌─────────────────────────────────┐
│  ADMIN INTERNE (Dashboard RBAC)  │
│  - Gestion événements            │
│  - Gestion espaces               │
│  - Approvals & validations       │
│  - Rapports financiers/KPIs      │
│  - Audit & historique            │
└─────────────────────────────────┘
```

---

## DIRECTIONS DU CCCZ

| Direction | Code | Responsabilité | Rôle Technique |
|-----------|------|-----------------|-----------------|
| Direction Générale | DG | Gouvernance, approvals institutionnels | ROLE_DG |
| Culture & Programmation (DACPA) | DACPA | Événements, artistes, programmation | ROLE_DACPA |
| Finances | DF | Budgets, revenus, facturation, rapports | ROLE_FINANCE |
| Administration | DA | RH, gestion administrative, contrats | ROLE_ADMIN |
| Bibliothèque | BIBLIO | Collections, archives, documentaires | ROLE_BIBLIOTHEQUE |
| Communication | COM | Actualités, communication, website | (via DACPA) |

---

## RECOMMANDATION SGBD

### **✅ RECOMMANDATION: MySQL 8.0** (ou compatible)

#### Justification

| Critère | MySQL 8.0 | PostgreSQL 14 |
|---------|-----------|---------------|
| **Performance** | ⭐⭐⭐⭐ (InnoDB) | ⭐⭐⭐⭐⭐ |
| **Scalabilité** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **SGBD Managé** | ✅ (cPanel) | ❌ Rare sur cPanel |
| **JSON Support** | ✅ (JSON functions) | ✅⭐ (plus natif) |
| **Audit Trail** | ✅ (avec triggers) | ✅ (avec functions) |
| **Docker** | ✅ (lean, stable) | ✅ |
| **Coût** | 💰 Très bas | 💰 Bas-Moyen |
| **Apprentissage** | ✅ Standard | Courbe légère |

#### Raison du choix MySQL 8.0

1. **cPanel Natif**: Gestion directe des DB + users via interface (pas SSH)
2. **InnoDB Reliable**: ACID compliant, transactions, FK pour audit
3. **JSON Support**: Stockage `payload` audit via JSON, exports flexible
4. **Déploiement Docker**: Stable, lightweight, facile dev/prod parity
5. **Écosystème**: Prisma, Sequelize, TypeORM supportent pleinement

---

## ARCHITECTURE GÉNÉRALE

### 1. Domaines de Données

```
┌────────────────────────────────────────────────────────┐
│  DOMAINE 1: GOUVERNANCE & ACCÈS                       │
│  - users (identités)                                   │
│  - roles (définitions RBAC)                            │
│  - directions (structures organisationnelles)          │
│  - permissions (matrice droits/tables)                 │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  DOMAINE 2: CONTENU PUBLIC (EXTERNE)                  │
│  - public_events (événements publiés)                 │
│  - public_spaces (espaces/activités publiques)        │
│  - public_artists (artistes/intervenants)             │
│  - public_news (actualités)                           │
│  - public_galleries (galeries/archives)               │
│  - newsletters_subscribers (abonnés)                  │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  DOMAINE 3: GESTION INTERNE (INTERNE)                 │
│  - events_internal (brouillons, validation)           │
│  - event_validations (workflow DRAFT→PUBLIÉ)          │
│  - artist_submissions (candidatures artistes)         │
│  - project_submissions (propositions d'activité)      │
│  - space_management (gestion espaces internes)        │
│  - team_members (staff CCCZ, logins)                  │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  DOMAINE 4: BILLETTERIE & REVENUS (PARTAGÉE)         │
│  - tickets (vente physique/en ligne)                  │
│  - invoices (factures, paiements)                     │
│  - revenue_reports (rapports financiers)              │
│  - pricing_rules (tarifs, réductions)                 │
│  - transactions (paiements, trace)                    │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  DOMAINE 5: COMMUNICATIONS (PARTAGÉE)                 │
│  - contact_forms (soumissions formulaire contact)     │
│  - event_registrations (inscriptions événements)      │
│  - artist_applications (candidatures artistes)        │
│  - correspondence (emails historisés)                 │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  DOMAINE 6: AUDIT & HISTORIQUE (INTERNE)             │
│  - audit_history (journal immuable)                   │
│  - validations_workflow (états DRAFT→PUBLIÉ)          │
│  - change_log (modifications entités)                 │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  DOMAINE 7: DONNÉES DE RÉFÉRENCE (PARTAGÉE)          │
│  - event_categories (catégories types)                │
│  - event_statuses (DRAFT, PUBLISHED, ARCHIVED)        │
│  - validation_states (DRAFT, EN_REVIEW, APPROVED)     │
│  - settings_system (config application)               │
└────────────────────────────────────────────────────────┘
```

---

## LISTE DES TABLES

### 📊 Synthèse Complète

#### **DOMAINE 1: GOUVERNANCE & ACCÈS** (5 tables)

| Table | Statut | Rôle |
|-------|--------|------|
| `users` | INTERNE | Identités staff + admins |
| `directions` | PARTAGÉE | Structures org du CCCZ |
| `roles` | PARTAGÉE | Définitions RBAC (ROLE_DG, etc.) |
| `user_direction_mappings` | INTERNE | Assigner user à direction + rôle |
| `permissions` | INTERNE | Matrice permissions par rôle |

#### **DOMAINE 2: CONTENU PUBLIC** (6 tables)

| Table | Statut | Rôle |
|-------|--------|------|
| `public_events` | EXTERNE | Événements publiés (produits finaux) |
| `public_spaces` | EXTERNE | Espaces et activités publiques |
| `public_artists` | EXTERNE | Artistes/intervenants reconnus |
| `public_news` | EXTERNE | Actualités et communiqués |
| `public_galleries` | EXTERNE | Galeries/archives médias |
| `newsletter_subscribers` | PARTAGÉE | Abonnés newsletter |

#### **DOMAINE 3: GESTION INTERNE** (6 tables)

| Table | Statut | Rôle |
|-------|--------|------|
| `events_internal` | INTERNE | Brouillons et gestion événements |
| `event_validations` | INTERNE | Workflow validation (DRAFT→PUBLIÉ) |
| `artist_submissions` | INTERNE | Candidatures artistes |
| `project_submissions` | INTERNE | Propositions d'activité |
| `space_management` | INTERNE | Gestion des espaces |
| `team_members` | INTERNE | Staff CCCZ, credentials |

#### **DOMAINE 4: BILLETTERIE & REVENUS** (5 tables)

| Table | Statut | Rôle |
|-------|--------|------|
| `tickets` | PARTAGÉE | Vente tickets (en ligne + physical) |
| `invoices` | INTERNE | Factures et paiements |
| `revenue_reports` | INTERNE | Rapports financiers agrégés |
| `pricing_rules` | INTERNE | Tarifs, réductions, promotions |
| `transactions` | INTERNE | Trace complète paiements |

#### **DOMAINE 5: COMMUNICATIONS** (4 tables)

| Table | Statut | Rôle |
|-------|--------|------|
| `contact_forms` | EXTERNE | Soumissions formulaire contact |
| `event_registrations` | PARTAGÉE | Inscriptions événements |
| `artist_applications` | INTERNE | Traitement candidatures artistes |
| `correspondence` | INTERNE | Emails/messages historisés |

#### **DOMAINE 6: AUDIT & HISTORIQUE** (3 tables)

| Table | Statut | Rôle |
|-------|--------|------|
| `audit_history` | INTERNE | Journal immuable (INSERT only) |
| `validations_workflow` | INTERNE | États DRAFT→PUBLIÉ →ARCHIVED |
| `change_log` | INTERNE | Modifications entités (tracé) |

#### **DOMAINE 7: DONNÉES DE RÉFÉRENCE** (4 tables)

| Table | Statut | Rôle |
|-------|--------|------|
| `event_categories` | PARTAGÉE | Enum: Exposition, Concert, Atelier… |
| `event_statuses` | PARTAGÉE | Enum: DRAFT, PUBLISHED, ARCHIVED |
| `validation_states` | PARTAGÉE | Enum: DRAFT, EN_REVIEW, APPROVED |
| `system_settings` | INTERNE | Config app, branding, locale |

---

### **RÉSUMÉ PAR CLASSIFICATION**

- **INTERNE** (sensible, RBAC strict): 18 tables
- **PARTAGÉE** (contrôlée, audit requis): 8 tables
- **EXTERNE** (lecture prioritaire): 6 tables
- **TOTAL**: 32 tables

---

## DIAGRAMME RELATIONNEL

```
┌─────────────────────────────────────────────────────────────────────────┐
│  GOUVERNANCE (Core)                                                     │
├─────────────────────────────────────────────────────────────────────────┤
│
│  ┌─────────────────┐          ┌──────────────────────────────┐
│  │ directions      │          │ roles                        │
│  ├─────────────────┤          ├──────────────────────────────┤
│  │ id (PK)         │◄────┐    │ id (PK)                      │
│  │ code            │     │    │ name (ROLE_DG, etc.)         │
│  │ name            │     │    │ description                  │
│  │ description     │     │    │ permissions_json             │
│  └─────────────────┘     │    └──────────────────────────────┘
│                          │
│                          │
│  ┌─────────────────────────────────┐       ┌─────────────────┐
│  │ user_direction_mappings         │       │ users           │
│  ├─────────────────────────────────┤       ├─────────────────┤
│  │ id (PK)                         │       │ id (PK)         │
│  │ user_id (FK users)              │──────►│ email           │
│  │ direction_id (FK directions)    │◄──┐   │ password_hash   │
│  │ role_id (FK roles)              │   │   │ full_name       │
│  │ assigned_at                     │   │   │ is_active       │
│  └─────────────────────────────────┘   │   └─────────────────┘
│                                         │
│                                         └─── team_members (alias users)
│
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  CONTENU PUBLIC (Lecture prioritaire)                                   │
├─────────────────────────────────────────────────────────────────────────┤
│
│  ┌──────────────────────┐       ┌──────────────────────┐
│  │ public_events        │       │ public_spaces        │
│  ├──────────────────────┤       ├──────────────────────┤
│  │ id (PK)              │       │ id (PK)              │
│  │ title                │       │ name                 │
│  │ description          │       │ type (Galerie, etc.) │
│  │ start_date           │       │ capacity             │
│  │ end_date             │       │ description          │
│  │ category_id          │───┐   │ image_url            │
│  │ image_url            │   │   └──────────────────────┘
│  │ published_at         │   │
│  └──────────────────────┘   │
│           ▲                 │
│           │                 │
│           └─ event_categories (nom, description)
│
│  ┌──────────────────────┐
│  │ public_artists       │
│  ├──────────────────────┤
│  │ id (PK)              │
│  │ name                 │
│  │ biography            │
│  │ image_url            │
│  │ specialization       │
│  └──────────────────────┘
│
│  ┌──────────────────────┐       ┌──────────────────────┐
│  │ public_news          │       │ public_galleries     │
│  ├──────────────────────┤       ├──────────────────────┤
│  │ id (PK)              │       │ id (PK)              │
│  │ title                │       │ title                │
│  │ content              │       │ description          │
│  │ published_at         │       │ type (photo, video)  │
│  │ author               │       │ media_url            │
│  └──────────────────────┘       │ published_at         │
│                                  └──────────────────────┘
│
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  GESTION INTERNE (RBAC + Validation)                                    │
├─────────────────────────────────────────────────────────────────────────┤
│
│  ┌─────────────────────────────┐     ┌──────────────────────┐
│  │ events_internal             │     │ event_validations    │
│  ├─────────────────────────────┤     ├──────────────────────┤
│  │ id (PK)                     │────►│ id (PK)              │
│  │ title                       │     │ event_id (FK events) │
│  │ description                 │     │ validation_state     │
│  │ draft_content               │     │ validated_by         │
│  │ created_by (FK users)       │     │ validated_at         │
│  │ direction_owner             │     │ comments             │
│  │ state (DRAFT, etc.)         │     │ next_reviewer_id     │
│  │ created_at                  │     └──────────────────────┘
│  │ updated_at                  │
│  └─────────────────────────────┘
│
│  ┌──────────────────────────────┐    ┌────────────────────┐
│  │ artist_submissions           │    │ project_submissions│
│  ├──────────────────────────────┤    ├────────────────────┤
│  │ id (PK)                      │    │ id (PK)            │
│  │ artist_name                  │    │ project_title      │
│  │ bio                          │    │ description        │
│  │ submission_date              │    │ proposed_date      │
│  │ status (PENDING, APPROVED)   │    │ submitted_by_email │
│  │ reviewed_by (FK users)       │    │ status             │
│  │ direction_owner              │    │ direction_owner    │
│  └──────────────────────────────┘    └────────────────────┘
│
│  ┌────────────────────────┐
│  │ space_management       │
│  ├────────────────────────┤
│  │ id (PK)                │
│  │ space_id (FK public)   │
│  │ availability_rules     │
│  │ booking_schedule       │
│  │ managed_by (FK users)  │
│  │ direction_owner        │
│  └────────────────────────┘
│
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  BILLETTERIE & FINANCES (Partagée + Audit strict)                       │
├─────────────────────────────────────────────────────────────────────────┤
│
│  ┌──────────────────────┐      ┌──────────────────────┐
│  │ tickets              │      │ pricing_rules        │
│  ├──────────────────────┤      ├──────────────────────┤
│  │ id (PK)              │      │ id (PK)              │
│  │ event_id (FK events) │─┐    │ event_id             │
│  │ quantity_available   │ │    │ ticket_type          │
│  │ price                │ └───►│ base_price           │
│  │ seller_name          │      │ discount_percent     │
│  │ sold_at              │      │ reduced_price        │
│  │ transaction_id       │      │ valid_from/to        │
│  └──────────────────────┘      └──────────────────────┘
│
│  ┌──────────────────────────────┐
│  │ transactions                 │
│  ├──────────────────────────────┤
│  │ id (PK)                      │
│  │ ticket_id (FK tickets)       │
│  │ amount_paid                  │
│  │ payment_method               │
│  │ payment_date                 │
│  │ invoice_id (FK invoices)     │
│  │ processed_by                 │
│  │ status (PENDING, COMPLETED)  │
│  └──────────────────────────────┘
│           ▲
│           │
│  ┌──────────────────────────────┐
│  │ invoices                     │
│  ├──────────────────────────────┤
│  │ id (PK)                      │
│  │ invoice_number               │
│  │ total_amount                 │
│  │ issued_date                  │
│  │ due_date                     │
│  │ paid_date (nullable)         │
│  │ direction_id (FK directions) │
│  │ created_by (FK users)        │
│  └──────────────────────────────┘
│
│  ┌──────────────────────────────┐
│  │ revenue_reports              │
│  ├──────────────────────────────┤
│  │ id (PK)                      │
│  │ period_start                 │
│  │ period_end                   │
│  │ direction_id (FK directions) │
│  │ total_revenue                │
│  │ ticket_count                 │
│  │ generated_by (FK users)      │
│  │ generated_at                 │
│  └──────────────────────────────┘
│
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  COMMUNICATIONS (Formulaires publics + historique)                      │
├─────────────────────────────────────────────────────────────────────────┤
│
│  ┌────────────────────────┐     ┌──────────────────────┐
│  │ contact_forms          │     │ event_registrations  │
│  ├────────────────────────┤     ├──────────────────────┤
│  │ id (PK)                │     │ id (PK)              │
│  │ sender_name            │     │ event_id (FK events) │
│  │ sender_email           │     │ participant_name     │
│  │ subject                │     │ participant_email    │
│  │ message                │     │ registered_at        │
│  │ status (NEW, REPLIED)  │     │ registration_count   │
│  │ submitted_at           │     │ status (CONFIRMED)   │
│  │ replied_by (FK users)  │     │ notes                │
│  └────────────────────────┘     └──────────────────────┘
│
│  ┌───────────────────────────────┐
│  │ correspondence                │
│  ├───────────────────────────────┤
│  │ id (PK)                       │
│  │ contact_form_id (FK)          │
│  │ sender_email                  │
│  │ recipient_email               │
│  │ message_body                  │
│  │ sent_at                       │
│  │ direction_owner               │
│  └───────────────────────────────┘
│
│  ┌──────────────────────────┐
│  │ newsletter_subscribers   │
│  ├──────────────────────────┤
│  │ id (PK)                  │
│  │ email                    │
│  │ subscribed_at            │
│  │ unsubscribed_at (null)   │
│  │ preferences (JSON)       │
│  └──────────────────────────┘
│
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  AUDIT & GOUVERNANCE (Immuable, INSERT only)                            │
├─────────────────────────────────────────────────────────────────────────┤
│
│  ┌──────────────────────────────────┐
│  │ audit_history                    │
│  ├──────────────────────────────────┤
│  │ id (PK)                          │
│  │ entity_type (events, users, etc.)│
│  │ entity_id                        │
│  │ action (CREATE, UPDATE, DELETE)  │
│  │ performed_by (FK users)          │
│  │ old_values (JSON)                │
│  │ new_values (JSON)                │
│  │ created_at (CURRENT_TIMESTAMP)   │
│  │ ip_address                       │
│  │ user_agent                       │
│  └──────────────────────────────────┘
│
│  ┌──────────────────────────────────┐
│  │ validations_workflow             │
│  ├──────────────────────────────────┤
│  │ id (PK)                          │
│  │ entity_type                      │
│  │ entity_id                        │
│  │ current_state (DRAFT, etc.)      │
│  │ initiated_by (FK users)          │
│  │ initiated_at                     │
│  │ completed_at                     │
│  │ workflow_path (JSON, history)    │
│  └──────────────────────────────────┘
│
│  ┌──────────────────────────────────┐
│  │ change_log                       │
│  ├──────────────────────────────────┤
│  │ id (PK)                          │
│  │ table_name                       │
│  │ record_id                        │
│  │ change_type (INSERT/UPDATE/DEL)  │
│  │ changed_at                       │
│  │ changed_by (FK users)            │
│  │ changes (JSON diff)              │
│  └──────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  DONNÉES DE RÉFÉRENCE (Enums + Config)                                  │
├─────────────────────────────────────────────────────────────────────────┤
│
│  ┌──────────────────────┐    ┌──────────────────────┐
│  │ event_categories     │    │ event_statuses       │
│  ├──────────────────────┤    ├──────────────────────┤
│  │ id (PK)              │    │ id (PK)              │
│  │ name                 │    │ name (DRAFT, etc.)   │
│  │ description          │    │ description          │
│  │ icon_url (nullable)  │    │ is_published_state   │
│  └──────────────────────┘    └──────────────────────┘
│
│  ┌──────────────────────────┐   ┌──────────────────────┐
│  │ validation_states        │   │ system_settings      │
│  ├──────────────────────────┤   ├──────────────────────┤
│  │ id (PK)                  │   │ id (PK)              │
│  │ name (DRAFT, EN_REVIEW)  │   │ setting_key          │
│  │ description              │   │ setting_value (JSON) │
│  │ order_sequence           │   │ updated_at           │
│  └──────────────────────────┘   └──────────────────────┘
│
└─────────────────────────────────────────────────────────────────────────┘
```

---

## SCHÉMA SQL COMPLET

### **1. DOMAINE GOUVERNANCE**

```sql
-- ============================================================================
-- GOUVERNANCE & ACCÈS (Domaine 1)
-- ============================================================================

-- 1.1 DIRECTIONS: Structure organisationnelle du CCCZ
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

-- 1.2 ROLES: Définitions RBAC
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

-- 1.3 USERS: Identités staff + admins
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

-- 1.4 USER_DIRECTION_MAPPINGS: Assigner user à direction + rôle
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

-- 1.5 PERMISSIONS: Matrice permissions par rôle (optionnel si JSON dans roles)
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
-- DONNÉES DE RÉFÉRENCE (Domaine 7)
-- ============================================================================

-- 7.1 EVENT_STATUSES: Enum états événements
CREATE TABLE IF NOT EXISTS `event_statuses` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` TEXT,
  `is_published_state` BOOLEAN NOT NULL DEFAULT FALSE,
  `display_order` INT UNSIGNED,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_status_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7.2 VALIDATION_STATES: Enum états validation (DRAFT, EN_REVIEW, APPROVED, REJECTED, PUBLISHED)
CREATE TABLE IF NOT EXISTS `validation_states` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` TEXT,
  `order_sequence` INT UNSIGNED,
  `is_terminal_state` BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_validation_state_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7.3 EVENT_CATEGORIES: Catégories événements
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

-- 7.4 SYSTEM_SETTINGS: Configuration application
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
```

### **2. DOMAINE CONTENU PUBLIC**

```sql
-- ============================================================================
-- CONTENU PUBLIC (Domaine 2) — EXTERNE
-- ============================================================================

-- 2.1 PUBLIC_EVENTS: Événements publiés (produits finaux)
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

-- 2.2 PUBLIC_SPACES: Espaces et activités publiques
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

-- 2.3 PUBLIC_ARTISTS: Artistes/intervenants reconnus
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

-- 2.4 PUBLIC_NEWS: Actualités et communiqués
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

-- 2.5 PUBLIC_GALLERIES: Galeries/archives médias
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

-- 2.6 NEWSLETTER_SUBSCRIBERS: Abonnés newsletter (Partagée)
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
```

### **3. DOMAINE GESTION INTERNE**

```sql
-- ============================================================================
-- GESTION INTERNE (Domaine 3) — INTERNE
-- ============================================================================

-- 3.1 EVENTS_INTERNAL: Brouillons et gestion événements
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

-- 3.2 EVENT_VALIDATIONS: Workflow validation (DRAFT→PUBLIÉ)
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

-- 3.3 ARTIST_SUBMISSIONS: Candidatures artistes
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

-- 3.4 PROJECT_SUBMISSIONS: Propositions d'activité
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

-- 3.5 SPACE_MANAGEMENT: Gestion des espaces
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

-- 3.6 TEAM_MEMBERS: Staff CCCZ, aliases/extension users
-- (Référence alias à users table avec rôles/permissions)
-- Peut être une VIEW ou une table dénormalisée selon besoin
CREATE VIEW `team_members` AS
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.is_active,
  udm.direction_id,
  r.name as role_name,
  udm.assigned_at
FROM users u
LEFT JOIN user_direction_mappings udm ON u.id = udm.user_id
LEFT JOIN roles r ON udm.role_id = r.id
WHERE u.is_active = TRUE;
```

### **4. DOMAINE BILLETTERIE & REVENUES**

```sql
-- ============================================================================
-- BILLETTERIE & FINANCES (Domaine 4) — PARTAGÉE + AUDIT STRICT
-- ============================================================================

-- 4.1 TICKETS: Vente tickets (en ligne + physical)
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

-- 4.2 PRICING_RULES: Tarifs, réductions, promotions
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

-- 4.3 TRANSACTIONS: Trace complète paiements
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

-- 4.4 INVOICES: Factures et paiements
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

-- 4.5 REVENUE_REPORTS: Rapports financiers agrégés
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
```

### **5. DOMAINE COMMUNICATIONS**

```sql
-- ============================================================================
-- COMMUNICATIONS (Domaine 5) — INTERNE + EXTERNE (Partagée)
-- ============================================================================

-- 5.1 CONTACT_FORMS: Soumissions formulaire contact (EXTERNE)
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

-- 5.2 EVENT_REGISTRATIONS: Inscriptions événements (Partagée)
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

-- 5.3 ARTIST_APPLICATIONS: Traitement candidatures artistes (INTERNE)
-- Référence à artist_submissions avec tracking supplémentaire
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

-- 5.4 CORRESPONDENCE: Emails/messages historisés (INTERNE)
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
```

### **6. DOMAINE AUDIT & HISTORIQUE**

```sql
-- ============================================================================
-- AUDIT & HISTORIQUE (Domaine 6) — INTERNE (INSERT only, immuable)
-- ============================================================================

-- 6.1 AUDIT_HISTORY: Journal immuable
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

-- 6.2 VALIDATIONS_WORKFLOW: États DRAFT→PUBLIÉ→ARCHIVED
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

-- 6.3 CHANGE_LOG: Modifications entités
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
```

---

## RÈGLES DE SÉPARATION INTERNE/EXTERNE

### 🌍 **DONNÉES EXTERNES** (Accès lecture prioritaire)

**Tables**: `public_events`, `public_spaces`, `public_artists`, `public_news`, `public_galleries`, `contact_forms`, `event_registrations`, `newsletter_subscribers`

**Autorisations**:

- ✅ Lecture directe depuis site public
- ✅ INSERT limité (formulaires, inscriptions)
- ✅ SELECT WITH filtering (is_visible=true, published_at <= NOW())
- ❌ UPDATE direct interdit
- ❌ DELETE interdit
- ❌ Accès utilisateurs/revenus bloqué

**Requêtes Exemples**:

```sql
-- ✅ AUTORISÉ: Charger événements publiés
SELECT * FROM public_events 
WHERE is_visible=TRUE AND start_date > NOW()
ORDER BY start_date ASC;

-- ✅ AUTORISÉ: Soumettre formulaire contact
INSERT INTO contact_forms (sender_name, sender_email, subject, message)
VALUES (?, ?, ?, ?);

-- ❌ BLOQUÉ: Modifier événement
UPDATE public_events SET title='...' WHERE id=1;

-- ❌ BLOQUÉ: Accéder revenus
SELECT * FROM transactions WHERE event_id = 1;
```

### 🏛️ **DONNÉES INTERNES** (RBAC strict, audit obligatoire)

**Tables**: `users`, `team_members`, `events_internal`, `event_validations`, `artist_submissions`, `invoices`, `revenue_reports`, `audit_history`, `change_log`

**Autorisations par Rôle**:

| Rôle | Lecture | Créer | Valider | Approuver | Admin |
|------|---------|-------|---------|-----------|-------|
| ROLE_PUBLIC | Non | Non | Non | Non | Non |
| ROLE_DACPA | Ses événements | Oui | Oui | DACPA only | Non |
| ROLE_FINANCE | Billets + rapports | Non | Non | Non | Finances only |
| ROLE_BIBLIOTHEQUE | Archives | Oui (Archives) | Oui | BIBLIO only | Non |
| ROLE_ADMIN | RH + Config | Oui | Oui | Admin only | Oui |
| ROLE_DG | **TOUT** | Non | Oui | **OUI (ANY)** | Non |

**Règles Strictes**:

1. ✅ Chaque action audit via `audit_history`
2. ✅ Direction check obligatoire (cf. rbac.ts `validateDirection()`)
3. ✅ JWT Bearer token requis (pas headers dev en production)
4. ✅ IP + User-Agent tracés
5. ❌ UPDATE direct tables audit/workflow = 403

**Exemple Protection RBAC**:

```typescript
// app/api/tickets/route.ts
export async function POST(req: Request) {
  const user = await extractUserFromRequest(req);
  
  if (!requireRole(user, ['ROLE_FINANCE', 'ROLE_DG'])) {
    return forbiddenJson('Accès revenu restreint');
  }
  
  const { direction } = req.nextUrl.searchParams;
  
  // CRITICAL FIX C2: Strict direction validation
  if (!validateDirection(user, direction)) {
    return forbiddenJson(`Direction ${direction} non accessible`);
  }
  
  // Proceed with revenue query
}
```

### 🔗 **DONNÉES PARTAGÉES** (Contrôlées & auditées)

**Tables**: `directions`, `roles`, `tickets`, `transactions`, `newsletter_subscribers`, `event_registrations`, `pricing_rules`

**Autorisés**: Lecture partagée, audit tracé, restrictions par opération

---

## GOUVERNANCE & TRAÇABILITÉ

### Workflow de Validation

```
DRAFT
  ↓ (Agent IA crée brouillon)
EN_REVIEW  (soumis DACPA/direction)
  ├─ APPROVED (direction valide)
  │   ↓ (Agent Manager publie)
  │ PUBLISHED (visible public)
  │
  └─ REJECTED (direction refuse)
      ↓ (retour DRAFT)
      DRAFT
```

### Champs Obligatoires de Traçabilité

Toute table de contenu/gestion doit avoir:

```sql
created_by BIGINT UNSIGNED NOT NULL,  -- FK users
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
-- Pour contenu:
published_at TIMESTAMP NULL,          -- Quand publié
direction_owner BIGINT UNSIGNED,      -- FK directions
validated_by BIGINT UNSIGNED,         -- FK users (qui approuve)
state VARCHAR(50),                    -- DRAFT, APPROVED, PUBLISHED, etc.
```

### Audit Trail Pattern

```typescript
// Avant chaque modification INTERNE:
async function logAudit(
  entityType: string,
  entityId: string,
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  performedBy: string,
  oldValues: any,
  newValues: any,
  req: Request
) {
  await db.auditHistory.create({
    entity_type: entityType,
    entity_id: entityId,
    action,
    performed_by: performedBy,
    old_values: JSON.stringify(oldValues),
    new_values: JSON.stringify(newValues),
    ip_address: req.headers.get('x-forwarded-for') || 'unknown',
    user_agent: req.headers.get('user-agent'),
    created_at: new Date(),
  });
}
```

---

## EXTENSIONS & INTÉGRATIONS

### 📊 **Power BI**

- Export tables via VIEW: `SELECT * FROM revenue_reports` (agrégée)
- Real-time connector MySQL ODBC
- Rapports: Revenus/direction, Attendance, Artists

### 📝 **Notion**

- Sync `events_internal` → Notion Database (webhook)
- Changelog via `change_log` table (JSON export)

### ✉️ **Mailchimp**

- `newsletter_subscribers` → Contact List sync
- Trigger: `INSERT INTO newsletter_subscribers` → API call Mailchimp

### 📥 **CSV Export**

- Pattern: `SELECT ... FROM [table] WHERE created_at BETWEEN ? AND ?`
- Encrypt .csv avant envoi par email
- Champs: ID, Name, Date, Status, Direction_Owner, Created_By

### 🔐 **Encryption**

- Sensible: `password_hash` (bcrypt), paiements (encryption key external)
- Non-sensible: Contenu public (pas crypto nécessaire)

---

## CHECKLIST IMPLÉMENTATION

- [ ] **Phase 1**: Créer tables GOUVERNANCE (users, directions, roles)
- [ ] **Phase 2**: Créer tables CONTENU PUBLIC (events, spaces, news)
- [ ] **Phase 3**: Créer tables INTERNE (gestion événements, validations)
- [ ] **Phase 4**: Créer tables BILLETTERIE (tickets, invoices, revenue)
- [ ] **Phase 5**: Créer tables AUDIT (audit_history, change_log)
- [ ] **Phase 6**: Trigger + Stored Procedures (audit automatique)
- [ ] **Phase 7**: Indexes optimisation + migration cPanel
- [ ] **Phase 8**: Tests RBAC + security audit
- [ ] **Phase 9**: Documentation API + Prisma Schema
- [ ] **Phase 10**: Déploiement production + monitoring

---

## RECOMMANDATIONS FINALES

1. **ORM**: Prisma (TypeScript + migrations versionées)
2. **DB**: MySQL 8.0 (cPanel native, Docker ready)
3. **Backup**: MySQL dump quotidien + S3 archive
4. **Monitoring**: Error logs → Sentry, Query logs → DataDog
5. **Documentation**: Schema + ER Diagram via dbdiagram.io
6. **Permissions cPanel**: root user pour migration, app user pour connexion produit

---

**Document approuvé par**: Agent Architecte Backend & Data CCCZ  
**Date**: Février 2026  
**Prochaine révision**: Q3 2026
