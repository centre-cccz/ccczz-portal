Déploiement sur VPS (Docker) — étapes rapides

1) Pré-requis
   - VPS (Ubuntu 22.04+), Docker et docker-compose installés
   - Ouvrir les ports nécessaires (3000) et configurer un reverse proxy (NGINX) pour SSL

2) Copier le projet sur le serveur
   - git clone ... ou scp/rsync depuis local

3) Variables
   - Créer un fichier .env (voir .env.example)

4) Lancer
   - docker-compose up -d --build

5) SSL
   - Configurer NGINX en front et obtenir certificats via Certbot (Let's Encrypt)

6) Backup
   - Sauvegarder la base MySQL (si externe) et créer snapshot du VPS régulièrement
