#!/bin/bash
set -e

echo ""
echo "======================================"
echo " FinCore Bank — Codespace Setup"
echo "======================================"

# ── PostgreSQL ──────────────────────────────
echo "[1/5] Starting PostgreSQL..."
sudo service postgresql start
sleep 3

echo "[1/5] Creating DB user and database..."
sudo -u postgres psql -c "CREATE USER admin WITH PASSWORD 'fincore123' SUPERUSER;" 2>/dev/null || echo "  (user already exists, skipping)"
sudo -u postgres psql -c "CREATE DATABASE fincore OWNER admin;" 2>/dev/null || echo "  (database already exists, skipping)"
echo "[1/5] PostgreSQL ready."

# ── Pipeline Python env ──────────────────────
echo "[2/5] Setting up pipeline virtual environment..."
cd /workspaces/fincore-app/pipeline
python3 -m venv venv
source venv/bin/activate
pip install --quiet -r requirements.txt
deactivate
cd /workspaces/fincore-app
echo "[2/5] Pipeline venv ready."

# ── App env files ────────────────────────────
echo "[3/5] Creating .env files from templates..."
[ -f app/.env ]      || cp app/.env.example app/.env
[ -f pipeline/.env ] || cp pipeline/.env.example pipeline/.env
echo "[3/5] .env files ready."

# ── Node.js dependencies ─────────────────────
echo "[4/5] Installing Node.js dependencies..."
cd /workspaces/fincore-app/app && npm install --silent
cd /workspaces/fincore-app/app/client && npm install --silent
cd /workspaces/fincore-app
echo "[4/5] Node.js dependencies ready."

# ── Test dependencies (base) ─────────────────
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
echo ""
echo " Next steps:"
echo "  1. Run the pipeline:  cd pipeline && source venv/bin/activate && bash run_pipeline.sh good_data"
echo "  2. Start the app:     bash start-app.sh"
echo "======================================"
