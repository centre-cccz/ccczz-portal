Title: Infrastructure — Configuration initiale cPanel (Node app)

Description:
- Créer l'application Node.js via cPanel (Setup Node.js App), définir App root, Node version et variables d'environnement.

Critères d'acceptation:
- App Node configurée et start command validée.

Tâches:
- Créer app dans Setup Node.js App
- Ajouter env vars (DB_*, NEXT_PUBLIC_BASE_URL)
- Vérifier que npm start lance l'app

Estimate: 1 jour
Labels: infra, cpanel
Assignees: @devops
Dependencies: 01-kickoff-access
