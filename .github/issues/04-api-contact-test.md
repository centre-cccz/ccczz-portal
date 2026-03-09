Title: API — Installer mysql2 et tester /api/contact

Description:
- Installer mysql2, tester que POST /api/contact insère en DB ou fallback file.

Critères d'acceptation:
- Requête POST renvoie 200 et enregistre dans contacts table ou data/contacts.json.

Tâches:
- npm install mysql2
- Executer test curl POST
- Vérifier entrée en DB

Estimate: 0.5 jour
Labels: backend, api
Assignees: @backend
Dependencies: 03-db-init
