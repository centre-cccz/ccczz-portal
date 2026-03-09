Scripts directory — automation for Agents tasks & RBAC System

## 🔐 RBAC System Scripts (NEW - Feb 6, 2026)

### `rbac-quickstart.js`

Quick reference guide and setup instructions for the RBAC system.

**Usage**:

```bash
node scripts/rbac-quickstart.js
```

**Shows**:

- 📚 Documentation links
- 🚀 Setup instructions
- 🧪 Testing commands
- 🎯 Role/permission matrix
- 🔗 Important links

### `verify-compliance.sh`

Automated compliance verification script for RBAC system.

**Usage**:

```bash
bash scripts/verify-compliance.sh
```

**Checks**:

- ✅ All required files exist
- ✅ Security features implemented
- ✅ Test coverage complete
- ✅ Rules compliance (7/7)
- ✅ Documentation present

**Output**: Pass/fail summary with percentage score

---

## 📋 Other Available Scripts

Available scripts:

- run_agents_tasks.sh  : Orchestrates import, build, backup, CI trigger
- import_mock_data.sh  : Writes mock JSON data into data/ and optionally seeds MySQL
- backup.sh            : Dumps MySQL (if configured) and archives public/images
- ci_trigger.sh        : Triggers GitHub Actions workflow dispatch or repository_dispatch

Usage examples:

- bash scripts/import_mock_data.sh
- bash scripts/backup.sh
- bash scripts/ci_trigger.sh   # requires GITHUB_TOKEN and GITHUB_REPO env vars
- bash scripts/run_agents_tasks.sh

Notes:

- These scripts are safe by default and check for required tools before running.
- Do not store secrets in scripts; use env vars or cPanel Application Manager to set secrets.
- RBAC scripts require Node.js 16+ and bash 4+

---

## 🚀 Common Tasks

### Check RBAC System Compliance

```bash
bash scripts/verify-compliance.sh
```

### View RBAC Quick Start Guide

```bash
node scripts/rbac-quickstart.js
```

### Run RBAC Tests

```bash
npm run test:rbac
```

### Full System Setup

```bash
bash scripts/run_agents_tasks.sh
```

### Backup Database & Files

```bash
bash scripts/backup.sh
```

---

## 📚 Documentation

- [docs/RBAC_USAGE.md](../docs/RBAC_USAGE.md) - Developer guide
- [docs/AUDIT_INDEX.md](../docs/AUDIT_INDEX.md) - Audit documentation
- [RBAC_AUDIT_SUMMARY.md](../RBAC_AUDIT_SUMMARY.md) - Audit summary

---

**Last Updated**: February 6, 2026  
**Status**: ✅ APPROVED CONDITIONAL
