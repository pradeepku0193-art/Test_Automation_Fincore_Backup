#!/bin/bash
set -e

# Resolve workspace root dynamically — works regardless of repo name
WORKSPACE="${CODESPACE_VSCODE_FOLDER:-/workspaces/$(ls /workspaces | head -1)}"
echo "Workspace: $WORKSPACE"
cd "$WORKSPACE"

echo ""
echo "======================================"
echo " FinCore Bank — Codespace Setup"
echo "======================================"

# ── PostgreSQL ──────────────────────────────
echo "[1/5] Starting PostgreSQL..."
sudo service postgresql start
sleep 3

echo "[1/5] Creating DB user and database..."
sudo -u postgres psql -c "CREATE USER admin WITH PASSWORD 'fincore123' SUPERUSER;" 2>/dev/null || echo "  (user exists)"
sudo -u postgres psql -c "CREATE DATABASE fincore OWNER admin;" 2>/dev/null || echo "  (db exists)"
echo "[1/5] PostgreSQL ready."

# ── Pipeline Python env ──────────────────────
echo "[2/5] Setting up pipeline virtual environment..."
cd "$WORKSPACE/pipeline"
python3 -m venv venv
source venv/bin/activate
pip install --quiet -r requirements.txt
deactivate
cd "$WORKSPACE"
echo "[2/5] Pipeline venv ready."

# ── App env files ────────────────────────────
echo "[3/5] Creating .env files from templates..."
[ -f "$WORKSPACE/app/.env" ]      || cp "$WORKSPACE/app/.env.example" "$WORKSPACE/app/.env"
[ -f "$WORKSPACE/pipeline/.env" ] || cp "$WORKSPACE/pipeline/.env.example" "$WORKSPACE/pipeline/.env"
echo "[3/5] .env files ready."

# ── Node.js dependencies ─────────────────────
echo "[4/5] Installing Node.js dependencies..."
cd "$WORKSPACE/app" && npm install --silent
cd "$WORKSPACE/app/client" && npm install --silent
cd "$WORKSPACE"
echo "[4/5] Node.js dependencies ready."

# ── Test dependencies ────────────────────────
echo "[5/5] Installing base test dependencies..."
pip install --quiet \
  pytest==7.4.4 \
  pytest-html==4.1.1 \
  great-expectations==0.18.15 \
  psycopg2-binary==2.9.9 \
  python-dotenv==1.0.0
echo "[5/5] Test dependencies ready."

echo ""
echo "======================================"
echo " Setup complete!"
echo " Next: cd pipeline && source venv/bin/activate && bash run_pipeline.sh good_data"
echo "======================================"
