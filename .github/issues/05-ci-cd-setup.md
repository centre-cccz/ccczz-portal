Title: CI/CD — Configurer GitHub Actions et secrets

Description:
- Ajouter le workflow .github/workflows/ci-cd.yml, configurer secrets (DEPLOY_METHOD, FTP/SSH credentials, REMOTE_PATH).

Critères d'acceptation:
- Workflow déclenche build et deploy sur push main (test run successful).

Tâches:
- Ajouter secrets au repo
- Pousser branch main pour test
- Valider déploiement sur staging

Estimate: 0.5 jour
Labels: devops, ci/cd
Assignees: @devops
Dependencies: 02-infra-cpanel-setup
