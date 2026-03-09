# 🔐 RBAC System - Documentation & Utilisation

**Centre Culturel Congolais Le Zoo (CCCZ)** - Backend Role-Based Access Control

---

## 📚 Table des Matières

1. [Architecture RBAC](#architecture-rbac)
2. [Utilisation des API Protégées](#utilisation-des-api-protégées)
3. [Rôles & Permissions](#rôles--permissions)
4. [Tests & Validation](#tests--validation)
5. [Troubleshooting](#troubleshooting)

---

## Architecture RBAC

### Composants Clés

```
lib/
├── types.ts           # Role, User interfaces
├── rbac.ts           # Fonctions auth (extract, check, validate)
├── jwt.ts            # JWT verification (Bearer token)
├── withAuth.ts       # Middleware wrapper pour routes
└── rbac.test.ts      # Test suite

app/api/
├── contact/          # Public endpoint (demo)
├── events/           # Create/Publish avec traçabilité
├── tickets/          # Price change + Revenue (Finance/DG)
└── reports/          # Power BI exports (Finance/DG)
```

### Flow d'Authentification

```
Request HTTP
  ↓
[1] Essayer Bearer token (Authorization: Bearer <jwt>)
    ├─ Si valid → Extract User from JWT
    └─ Si invalid → Null
  ↓
[2] Si null et NODE_ENV=development → Try headers (x-user-*)
    ├─ x-user-id, x-user-role, x-user-direction-id
    └─ WARNING: DEV ONLY, ne pas utiliser en PROD
  ↓
[3] withAuth middleware
    ├─ Si user=null && !allowPublic → 401 Unauthorized
    ├─ Si user && !allowedRoles → 403 Forbidden
    └─ Sinon → Handler avec user
  ↓
[4] Handler (route.ts)
    ├─ Vérifications additionnelles (direction, etc.)
    └─ Retour réponse ou 403/401
```

---

## Utilisation des API Protégées

### 1️⃣ Endpoint Public: POST /api/contact

**Autorisation**: ✅ Aucune (public)

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Bonjour"
  }'
```

### 2️⃣ Endpoint Protégé: POST /api/events

#### Créer événement (DACPA seulement)

```bash
# Step 1: Obtenir JWT token
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -d '{"username":"dacpa_user","password":"pwd"}' \
  -H "Content-Type: application/json" \
  | jq -r '.token')

# Step 2: Créer événement
curl -X POST "http://localhost:3000/api/events?action=create" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Expo Culturelle",
    "direction_owner": "DACPA"
  }'
```

**Réponse (200 OK)**:

```json
{
  "ok": true,
  "event": {
    "id": "evt_1707214800000",
    "title": "Expo Culturelle",
    "direction_owner": "DACPA",
    "created_by": "user1",
    "validated_by": null,
    "status": "draft",
    "created_at": "2026-02-06T10:00:00.000Z"
  }
}
```

#### Publier événement (DACPA + DG)

```bash
# DACPA publie événement (même direction)
curl -X POST "http://localhost:3000/api/events?action=publish" \
  -H "Authorization: Bearer $DACPA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "direction_owner": "DACPA",
    "note": "Approuvé pour publication"
  }'

# DG publie événement (any direction)
curl -X POST "http://localhost:3000/api/events?action=publish" \
  -H "Authorization: Bearer $DG_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "direction_owner": "MEDIA",
    "note": "Approuvé au niveau DG"
  }'
```

### 3️⃣ Endpoint Protégé: POST /api/tickets

#### Modifier prix (FINANCE seulement)

```bash
curl -X POST "http://localhost:3000/api/tickets?action=price-change" \
  -H "Authorization: Bearer $FINANCE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "direction_owner": "FINANCES",
    "newPrice": 50000
  }'
```

**Erreur (403 Forbidden)** si DACPA essaye:

```json
{
  "ok": false,
  "error": "forbidden"
}
```

#### Consulter revenus (FINANCE + DG)

```bash
# FINANCE voit revenus propre direction uniquement
curl -X POST "http://localhost:3000/api/tickets?action=revenue" \
  -H "Authorization: Bearer $FINANCE_TOKEN" \
  -H "Content-Type: application/json" \
  '?direction=FINANCES'

# DG voit revenus any direction
curl -X POST "http://localhost:3000/api/tickets?action=revenue" \
  -H "Authorization: Bearer $DG_TOKEN" \
  '?direction=MEDIA'
```

**Erreur (403 Forbidden)** si FINANCE essaye direction autre:

```json
{
  "ok": false,
  "error": "cannot access other direction revenue"
}
```

### 4️⃣ Endpoint Protégé: POST /api/reports

#### Power BI Export (FINANCE + DG)

```bash
# FINANCE exporte rapports propre direction
curl -X POST http://localhost:3000/api/reports \
  -H "Authorization: Bearer $FINANCE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "direction": "FINANCES"
  }'

# DG exporte any direction
curl -X POST http://localhost:3000/api/reports \
  -H "Authorization: Bearer $DG_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "direction": "MEDIA"
  }'
```

**Erreur (403 Forbidden)** si FINANCE essaye autre direction:

```json
{
  "ok": false,
  "error": "cannot export other direction reports"
}
```

---

## Rôles & Permissions

### Tableau des Rôles

| Rôle | Création Événement | Publie Événement | Prix Ticket | Revenus | Rapports | Cross-Dir |
|------|:-:|:-:|:-:|:-:|:-:|:-:|
| **ROLE_DACPA** | ✅ | ✅ (propre) | ❌ | ❌ | ❌ | ❌ |
| **ROLE_FINANCE** | ❌ | ❌ | ✅ (propre) | ✅ (propre) | ✅ (propre) | ❌ |
| **ROLE_DG** | ❌ | ✅ (any) | ❌ | ✅ (any) | ✅ (any) | ✅ |
| **ROLE_BIBLIOTHEQUE** | ❌ | ✅ (propre) | ❌ | ❌ | ❌ | ❌ |
| **ROLE_PUBLIC** | ❌ | ❌ | ❌ (achat ✅) | ❌ | ❌ | ❌ |
| **ROLE_ADMIN** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Direction Isolation

Chaque utilisateur est lié à une `direction_id`:

- `DACPA`
- `FINANCES`
- `MEDIA`
- `BIBLIOTHEQUE`
- `DIRECTION_GENERALE`
- `INTENDANCE`
- `ANIMATION_CULTURELLE`

**Règles**:

- Utilisateur ne peut agir que sur sa direction
- SAUF `ROLE_DG` (Directeur Général) qui peut agir sur toutes directions
- Exemple: FINANCE(MEDIA) ne peut pas modifier prix direction FINANCES

---

## Tests & Validation

### Exécuter Test Suite

```bash
# Dans le workspace, importer et exécuter
npm run test:rbac

# Ou directement avec Node.js
node -r esbuild-register lib/rbac.test.ts
```

### Test Coverage

| Test | Scenario | Status |
|------|----------|--------|
| C1 | JWT Bearer token extraction | ✅ |
| C2 | Revenue direction validation | ✅ |
| C3 | Reports direction validation | ✅ |
| validateDirection() | Strict direction checks | ✅ |
| Integration | 6 scénarios RBAC | ✅ |

### Example Output

```
🔍 RBAC QA Test Suite - Critical Fixes Validation
════════════════════════════════════════════════════════════

✅ TEST C2: Revenue Direction Validation

User: user3 (ROLE_FINANCE, dir=MEDIA)
Requested: FINANCES
Access Granted: ✅ NO (CORRECT)

✅ TEST C3: Reports Direction Validation

User: user3 (ROLE_FINANCE, dir=MEDIA)
Export Request: FINANCES
Export Granted: ✅ NO (CORRECT)

✅ INTEGRATION TESTS

A. DACPA create event (same dir): ✅ PASS
B. DACPA create event (diff dir): ✅ PASS
C. FINANCE modify price (same dir): ✅ PASS
D. FINANCE modify price (diff dir): ✅ PASS
E. DG publish (any direction): ✅ PASS
F. DG access reports (any dir): ✅ PASS

INTEGRATION SCORE: 6/6 tests passed

🎉 ALL TESTS PASSED
════════════════════════════════════════════════════════════
```

---

## Headers Authorization

### Production: JWT Bearer Token

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Format JWT Payload**:

```json
{
  "id": "user1",
  "role": "ROLE_FINANCE",
  "direction_id": "FINANCES",
  "iat": 1707214800,
  "exp": 1707301200
}
```

### Development: Custom Headers (dev only)

```http
x-user-id: user1
x-user-role: ROLE_FINANCE
x-user-direction-id: FINANCES
```

⚠️ **WARNING**: Headers non signés ne doivent **jamais** être utilisés en production!

---

## Traçabilité & Audit

### Chaque entité (event, ticket, etc.) possède

```typescript
{
  id: string;
  created_by: string;      // ID utilisateur qui a créé
  validated_by?: string;   // ID utilisateur qui a validé
  direction_owner: string; // Direction propriétaire
  created_at: string;      // ISO timestamp
  status: string;          // draft, published, archived, etc.
}
```

### Audit History (immuable)

```json
// data/events_history.json
[
  {
    "action": "create",
    "by": "user1",
    "event": { ... },
    "at": "2026-02-06T10:00:00.000Z"
  },
  {
    "action": "publish",
    "by": "user4",
    "direction": "DACPA",
    "note": "Approuvé",
    "at": "2026-02-06T10:15:00.000Z"
  }
]
```

Historique **non supprimable** (append-only):

- Tous les changements tracés
- Responsabilité audit complète
- Conformité institutionnelle

---

## Troubleshooting

### 401 Unauthorized

**Problème**: "authentication required"

**Solutions**:

1. Vérifier Bearer token valide

   ```bash
   echo $TOKEN | base64 -d | jq .
   ```

2. Vérifier NODE_ENV en dev

   ```bash
   echo $NODE_ENV
   ```

3. Vérifier headers en dev

   ```bash
   curl -H "x-user-id: user1" \
        -H "x-user-role: ROLE_FINANCE" \
        -H "x-user-direction-id: FINANCES" \
        http://localhost:3000/api/events
   ```

### 403 Forbidden

**Problème**: "role not allowed" ou "cannot act outside your direction"

**Solutions**:

1. Vérifier rôle utilisateur

   ```bash
   # DACPA ne peut pas modifier prix
   curl -H "x-user-role: DACPA" ...
   # → 403
   ```

2. Vérifier direction

   ```bash
   # FINANCE(MEDIA) ne peut pas accéder FINANCES
   curl -H "x-user-direction-id: MEDIA" ...
          -d '{"direction": "FINANCES"}'
   # → 403 "cannot access other direction revenue"
   ```

3. Vérifier allowedRoles dans route

   ```typescript
   export const POST = withAuth(handler, {
     allowedRoles: ['ROLE_FINANCE', 'ROLE_DG']
   });
   ```

### Logs Utiles

```bash
# Vérifier headers reçus
console.log(request.headers);

# Vérifier user extrait
console.log(await extractUserFromRequest(request));

# Vérifier direction validation
console.log(validateDirection(user, targetDir));
```

---

## Intégration JWT

Remplacer `lib/jwt.ts` stub par votre JWT signer:

```typescript
// lib/jwt.ts (production)
import { jwtVerify } from 'jose';
import { User } from './types';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    // Valider payload a role et direction_id
    if (!payload.role || !payload.direction_id) return null;
    return {
      id: payload.sub || payload.id,
      role: payload.role,
      direction_id: payload.direction_id,
    } as User;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return null;
  }
}
```

---

## Migrations DB

Appliquer les ALTERs pour ajouter champs governance:

```sql
-- tables existantes: events, tickets, budgets, etc.
ALTER TABLE `events` 
  ADD COLUMN `created_by` VARCHAR(191) NULL,
  ADD COLUMN `validated_by` VARCHAR(191) NULL,
  ADD COLUMN `direction_owner` VARCHAR(191) NULL;

ALTER TABLE `tickets`
  ADD COLUMN `created_by` VARCHAR(191) NULL,
  ADD COLUMN `direction_owner` VARCHAR(191) NULL;

-- Créer audit_history (voir db/init.sql)
CREATE TABLE IF NOT EXISTS `audit_history` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `entity_type` VARCHAR(100) NOT NULL,
  `entity_id` VARCHAR(191) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `performed_by` VARCHAR(191) NULL,
  `payload` JSON NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
```

---

## Références

- [Audit Complet](AUDIT_RBAC_QA.md) - Rapport détaillé d'audit
- [Checklist Conformité](RBAC_COMPLIANCE.md) - Décision finale + approbations
- [RBAC Types](../lib/types.ts) - Définitions Role/User
- [RBAC Helpers](../lib/rbac.ts) - Fonctions auth
- [JWT Module](../lib/jwt.ts) - JWT verification
- [Test Suite](../lib/rbac.test.ts) - Tests validation

---

**Document généré**: 2026-02-06  
**Dernière mise à jour**: 2026-02-06
