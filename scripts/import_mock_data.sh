#!/usr/bin/env bash
set -euo pipefail

# import_mock_data.sh
# Writes JSON mock data into data/ directory for use by the app or for seeding DB.

ROOT=$(cd "$(dirname "$0")/.." && pwd)
DATA_DIR="$ROOT/data"
mkdir -p "$DATA_DIR"

cat > "$DATA_DIR/artists.json" <<'JSON'
[
  { "name": "Koumba Mbongo", "discipline": "Musique", "bio": "Compositeur et promoteur de musiques traditionnelles." },
  { "name": "Lola M", "discipline": "Danse", "bio": "Chorégraphe de projets communautaires." },
  { "name": "Jean-Pierre K.", "discipline": "Arts visuels", "bio": "Plasticien engagé dans la mémoire collective." }
]
JSON

cat > "$DATA_DIR/projects.json" <<'JSON'
[
  { "title": "Bibliothèque Numérique", "summary": "Archivage et accès libre aux ressources culturelles." },
  { "title": "Réhabilitation", "summary": "Rénovation des espaces publics du centre." },
  { "title": "Plateforme e-learning", "summary": "Formations en ligne pour jeunes artistes." }
]
JSON

cat > "$DATA_DIR/events.json" <<'JSON'
[
  { "title": "Festival Jeune Création", "date": "2026-05-12", "location": "Place des Arts" },
  { "title": "Atelier Numérique", "date": "2026-04-20", "location": "CCC Le Zoo" }
]
JSON

cat > "$DATA_DIR/directions.json" <<'JSON'
[
  { "name": "Direction générale", "role": "DG", "description": "Supervision et stratégie institutionnelle." },
  { "name": "Finances", "role": "Responsable Financier", "description": "Gestion comptable et budget." },
  { "name": "Administration", "role": "Administration", "description": "Ressources humaines et logistique." }
]
JSON

# If DB is configured, optionally try to insert into MySQL (mysql client required)
if [ -n "${DB_HOST-}" ] && command -v mysql >/dev/null 2>&1; then
  echo "[import] DB_HOST detected - attempting to seed MySQL (contacts/projects/events/directions as simple inserts)"
  if [ -z "${DB_NAME-}" ] || [ -z "${DB_USER-}" ]; then
    echo "[import] DB_NAME or DB_USER missing - skipping DB inserts"
  else
    # Example: create simple inserts for directions table if exists
    mysql -h "$DB_HOST" -P "${DB_PORT-3306}" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "INSERT INTO contacts (name,email,message) VALUES ('Seed','seed@local','seeded via import script')" || true
    echo "[import] DB insert attempts finished (non-fatal on error)"
  fi
else
  echo "[import] No DB configured or mysql client missing - mock JSON files written to $DATA_DIR"
fi

echo "[import] Done. Files created in $DATA_DIR"
