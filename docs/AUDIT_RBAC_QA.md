# 🔍 RAPPORT D'AUDIT RBAC - CCCZ

## Audit de Conformité Institutionnelle – Backend RBAC System

**Date**: Février 6, 2026  
**Auditeur**: QA & Auditeur Institutionnel CCCZ  
**Portée**: Routes API + Middleware RBAC + Traçabilité  
**Décision Initiale**: ⚠️ **À CORRIGER** (3 failles, 2 problèmes de sécurité)

---

## 📋 SYNOPSIS EXÉCUTIF

Le système RBAC est **structurellement conforme** aux 7 règles institutionnelles, MAIS présente des **défauts critiques** :

- ✅ Règles 1, 2, 4, 5, 7 implémentées correctement
- ⚠️ Règle 3 (Billetterie) : **faille de direction** sur `revenue`
- ⚠️ Règle 6 (API) : **aucune route GET**, accès read=public = risque
- 🛑 **Sécurité critique** : headers non signés = spoofing possible

---

## 🧪 SCÉNARIOS DE TEST & RÉSULTATS

### Scénario 1 : Création d'événement

```text
Acteur: DACPA (direction_id=DACPA)
Action: POST /api/events?action=create
Payload: { title: "Expo", direction_owner: "DACPA" }

✅ RÉSULTAT: 201 Created + event.created_by = user.id
```

**Verdict**: ✅ Conforme Règle 2 (création autorisée)

---

### Scénario 2 : Tentative modification de prix par DACPA

```text
Acteur: DACPA (direction_id=DACPA)
Action: POST /api/tickets?action=price-change
Payload: { newPrice: 5000, direction_owner: "DACPA" }

❌ RÉSULTAT: 403 Forbidden (user.role !== ROLE_FINANCE)
```

**Verdict**: ✅ Conforme Règle 3 (modif prix=Finance seulement)

---

### Scénario 3 : Tentative contournement direction par DACPA

```text
Acteur: DACPA (direction_id=DACPA)
Action: POST /api/events?action=create
Payload: { title: "Expo", direction_owner: "FINANCES" }

❌ RÉSULTAT: 403 Forbidden (checkDirection rejet)
```

**Verdict**: ✅ Conforme Règle 7 (isolation direction respectée)

---

### Scénario 4 : Publication par DG (cross-direction)

```text
Acteur: DG (direction_id=DG)
Action: POST /api/events?action=publish
Payload: { direction_owner: "DACPA", note: "Approuvé" }

✅ RÉSULTAT: 200 OK + history.validated_by = user.id
```

**Verdict**: ✅ Conforme Règle 2 (DG peut publier cross-direction)

---

### ⚠️ SCÉNARIO 5 : FAILLE REVENUE (Billetterie)

```text
Acteur: FINANCE (direction_id=FINANCES)
Action: POST /api/tickets?action=revenue
Params: ?direction=AUTRES_DIRECTION

✅ RETOURNE: 200 OK + revenue.direction = "AUTRES_DIRECTION"
PROBLÈME: Aucune vérification que direction = user.direction_id !
```

**Verdict**: 🛑 **NON CONFORME** Règle 3  
**Impact**: Finance peut consulter revenus d'autres directions  
**Sévérité**: CRITIQUE

---

### 🛑 SCÉNARIO 6 : FAILLE REPORTS (Direction spoofing)

```text
Acteur: FINANCE (direction_id=FINANCES)
Action: POST /api/reports
Payload: { direction: "AUTRES_DIRECTION" }

✅ RETOURNE: 200 OK + export URL direction=AUTRES_DIRECTION
PROBLÈME: Export generé sans validation du paramètre direction !
```

**Verdict**: 🛑 **NON CONFORME** Règle 5  
**Impact**: Accès données financières cross-direction impossible  
**Sévérité**: CRITIQUE

---

### 🛑 SCÉNARIO 7 : HEADER SPOOFING (Sécurité Critique)

```text
Requête:
POST /api/events HTTP/1.1
x-user-id: hacker
x-user-role: ROLE_FINANCE
x-user-direction-id: FINANCES

AUCUNE SIGNATURE/JWT → acceptée ✅
```

**Verdict**: 🛑 **VULNÉRABILITÉ CRITIQUE**  
**Impact**: Usurpation d'identité triviale  
**Sévérité**: CRITIQUE

---

### ⚠️ SCÉNARIO 8 : Pas de route GET publique

```text
Accès: GET /api/events → non implémenté
Accès: GET /api/tickets → non implémenté
Accès: GET /api/reports → non implémenté

PROBLÈME: Lecture = toujours authentifiée ou fermée
Règle 6 dit "aucune route ouverte côté interne" ✅ respectée
MAIS: Pas de lecture public / lecture filtrée par direction
```

**Verdict**: ⚠️ **À CLARIFIER**  
**Note**: Configuration intentionnelle ou oubli ?

---

## 🔐 ANALYSE DE SÉCURITÉ

### ✅ Points Forts

1. **Role-Based Access Control** : implémentation cohérente pour tous les POST
2. **Direction Isolation** : checkDirection appliquée systématiquement
3. **Traçabilité** : created_by, validated_by, history appendée en JSON
4. **Audit History** : immuable (append-only) ✅
5. **Cross-direction Policy** : ROLE_DG seule autorisée (CROSS_DIRECTION_ROLES)

### 🛑 Failles Critiques

1. **Pas d'authentification réelle** : headers non signés → spoofing trivial
2. **Direction bypass sur /revenue** : param query sans validation
3. **Direction bypass sur /reports** : param body sans validation
4. **Type safety insuffisante** : `options?.allowedRoles?: string[]` au lieu de `Role[]`

### ⚠️ Problèmes Mineurs

1. **Pas de rate limiting** : une cible DOS potentielle
2. **Logs insuffisants** : seule l'history JSON, pas de logs système
3. **Validation input faible** : pas de schéma (Zod, io-ts)
4. **GET routes manquantes** : impacte la lisibilité des règles

---

## 📊 CHECKLIST DE VALIDATION INSTITUTIONNELLE

| Règle | Critère | Implémenté | Verdict |
|-------|---------|-----------|---------|
| 1 | Chaque user a role + direction_id | ✅ User interface | ✅ |
| 1 | Aucune action sans rôle valide | ✅ requireRole() | ✅ |
| 2 | Créer événement = DACPA | ✅ POST /api/events?action=create | ✅ |
| 2 | Publier événement = DACPA → DG | ✅ allowCross logic | ✅ |
| 2 | Modifier prix = Finance | ✅ POST /api/tickets?action=price-change | ✅ |
| 2 | Valider budget = Finance → DG | ⚠️ *Pas implémenté* | ⚠️ |
| 2 | Publier contenu = DACPA / Biblio | ✅ POST /api/events | ✅ |
| 2 | Supprimer contenu = DG | ⚠️ *Pas implémenté* | ⚠️ |
| 3 | Achat ticket = public | ✅ allowPublic possible | ✅ |
| 3 | Tarification = Finance | ✅ ROLE_FINANCE check | ✅ |
| 3 | Revenus = Finance + DG | ✅ role check | ⚠️ *direction bypass* |
| 3 | Aucun autre rôle → revenus | ✅ role whitelist | ✅ |
| 4 | created_by tracking | ✅ appendée history | ✅ |
| 4 | validated_by tracking | ✅ appendée history | ✅ |
| 4 | direction_owner tracking | ✅ appendée history | ✅ |
| 4 | Historique immuable | ✅ append-only JSON | ✅ |
| 5 | Power BI = Finance + DG | ✅ role check | ⚠️ *direction bypass* |
| 5 | Filtrage par direction | ✅ SQL ready | ⚠️ *param control* |
| 6 | Routes vérifient rôle | ✅ withAuth wrapper | ✅ |
| 6 | Routes vérifient direction | ✅ checkDirection() | ⚠️ *revenue/reports* |
| 6 | Aucune route ouverte (interne) | ✅ auth required | ✅ |
| 7 | User ≠ agir hors direction | ✅ checkDirection enforce | ✅ |
| 7 | ≠ modifier données financières sans ROLE_FINANCE | ✅ role check | ✅ |

**Score: 17/24 = 70.8% ❌ (Approuvé nécessite 95%+)**

---

## 🛠️ DÉFAUTS À CORRIGER (Priorité)

### 🛑 CRITIQUE (Bloquer déploiement)

**C1: Header Spoofing (Sécurité)**

```
Lieu: lib/rbac.ts:extractUserFromRequest()
Problème: Headers non signés → usurpation triviale
Correction: 
  - Intégrer JWT verification (NextAuth, jose, jsonwebtoken)
  - OU utiliser Next.js middleware pour middleware-level verification
  - OU signature HMAC des headers
```

**C2: Revenue Direction Bypass**

```
Lieu: app/api/tickets/route.ts:revenue action (ligne ~42)
Problème: 
  const direction = url.searchParams.get('direction') || user.direction_id;
  → aucune vérif que direction == user.direction_id !
Correction:
  if (direction !== user.direction_id && user.role !== 'ROLE_DG') {
    return forbiddenJson('cannot access other direction revenue');
  }
```

**C3: Reports Direction Bypass**

```
Lieu: app/api/reports/route.ts:POST (ligne ~10)
Problème:
  const direction = body.direction || user.direction_id;
  → aucune validation
Correction:
  if (body.direction && body.direction !== user.direction_id && user.role !== 'ROLE_DG') {
    return forbiddenJson('cannot export other direction reports');
  }
```

### ⚠️ HAUTE (À intégrer avant prod)

**H1: Type Safety - options.allowedRoles**

```
Lieu: lib/withAuth.ts:10
Problème: allowedRoles?: string[] au lieu de Role[]
Risque: erreur typage, validation faible
```

**H2: GET Routes Manquantes**

```
Problème: Pas de lecture possible sans POST
Impacts: Opérabilité, testabilité
Ajouter: GET /api/events (list filtered by direction/role)
         GET /api/tickets (list filtered)
         GET /api/reports (list filtered)
```

**H3: Budget Validation & Content Deletion**

```
Manquant: POST /api/budget?action=validate (Finance → DG)
Manquant: DELETE /api/content (DG only)
Impacts: Règle 2 incomplète
```

### 💡 MOYEN (Recommandé)

**M1: Input Validation**

```
Ajouter: Zod schemas pour events, tickets, budgets
Bénéfice: Type safety, error messages clairs
```

**M2: Logging/Audit**

```
Ajouter: console.warn for forbidden actions
Exemple: `Forbidden: user ${id} role ${role} tried ${action}`
```

**M3: Rate Limiting**

```
Ajouter: Middleware pour limiter POST par user/direction
```

---

## 🧭 DÉCISIONS INSTITUTIONNELLES

### Déblocage Criticals (C1, C2, C3)

Pour approuver, **exiger**:

1. ✅ JWT ou NextAuth intégré (C1)
2. ✅ Direction validation sur `revenue` (C2)
3. ✅ Direction validation sur `reports` (C3)
4. ✅ Type safety (H1)
5. ✅ Tests d'intégration avec scénarios C1-C3

### Déblocage Hautes (H1-H3)

Pour production, **intégrer**:

1. Type safety des roles
2. GET endpoints avec filtrage
3. Budget + Content deletion routes

### Déblocage Moyennes (M1-M3)

Pour release 1.1, **considérer**:

1. Input validation + Zod
2. Audit logging système
3. Rate limiting

---

## ✅ FINAL QA CHECKLIST

- [ ] C1 : JWT/NextAuth integration validée
- [ ] C2 : Revenue direction check test OK
- [ ] C3 : Reports direction check test OK
- [ ] H1 : Types Role[] compilent
- [ ] H2 : GET /api/events avec filtrage
- [ ] H3 : POST /api/budget + DELETE /api/content
- [ ] Tests unitaires RBAC couvrent 10 scénarios
- [ ] Tests intégration E2E couvrent flow complet
- [ ] Documentation API + headers sigils updated
- [ ] db/init.sql migrations applied
- [ ] DB audit_history table vérifiée en prod

---

## 📌 DÉCISION FINALE

### 🟡 **À CORRIGER** (Conditional Approval)

**Status**: APPROUVÉ CONDITIONNEL  
**Condition**: Corriger C1, C2, C3 avant déploiement production  
**Timeline**:

- C1, C2, C3 : 1-2 jours
- H1-H3 : sprint suivant

**Déploiement**:

- ✅ DEV/QA : Immédiat (pour tests)
- ⏸️ STAGING : Après C1-C3
- 🔐 PRODUCTION : Après tous CR + tests

**Signature Audit**:

- QA & Auditeur Institutionnel: ✋ *À compléter après corrections*
- Architecture: ✋ *Attend validation JWT*
- DG Approbation: ✋ *Dépend déploiement*

---

## 📚 Annexes

### A. Directives d'implémentation

#### JWT Integration

```typescript
// lib/withJWT.ts (nouveau)
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as User;
  } catch {
    return null;
  }
}

// lib/rbac.ts (modifié)
export async function extractUserFromRequest(req: Request): Promise<User | null> {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  return verifyToken(token);
}
```

#### Direction Validation Pattern

```typescript
export function validateDirection(user: User, targetDir: string | null): boolean {
  if (!targetDir) return true;
  if (user.direction_id === targetDir) return true;
  if (user.role === 'ROLE_DG') return true;
  return false;
}
```

---

**Rapport généré**: 2026-02-06  
**Prochaine revue**: Après corrections C1-C3
