#!/bin/bash
set -e

WORKSPACE="${CODESPACE_VSCODE_FOLDER:-/workspaces/$(ls /workspaces | head -1)}"
echo "Workspace: $WORKSPACE"
cd "$WORKSPACE"

echo ""
echo "======================================"
echo " FinCore Bank — Codespace Setup"
echo "======================================"

# ── [1/8] PostgreSQL via apt ─────────────────
echo "[1/8] Installing PostgreSQL..."
sudo apt-get update -qq
sudo apt-get install -y -qq postgresql postgresql-client
echo "[1/8] Done."

# ── [2/8] Fix pg_hba.conf auth ──────────────
echo "[2/8] Configuring PostgreSQL auth..."
PG_HBA=$(sudo -u postgres psql -t -c "SHOW hba_file;" | xargs)
sudo sed -i 's/peer/md5/g' "$PG_HBA"
sudo sed -i 's/scram-sha-256/md5/g' "$PG_HBA"
sudo service postgresql restart
sleep 3
sudo -u postgres psql -c "CREATE USER admin WITH PASSWORD 'fincore123' SUPERUSER;" 2>/dev/null || echo "  (user exists)"
sudo -u postgres psql -c "CREATE DATABASE fincore OWNER admin;" 2>/dev/null || echo "  (db exists)"
PGPASSWORD=fincore123 psql -h localhost -U admin -d fincore -c "SELECT 1;" > /dev/null 2>&1 \
  && echo "[2/8] PostgreSQL ready — connection verified." \
  || echo "[2/8] WARNING: DB connection check failed."

# ── [3/8] JAVA_HOME for PySpark ─────────────
echo "[3/8] Setting JAVA_HOME..."
JAVA_PATH=$(readlink -f $(which java))
export JAVA_HOME=$(dirname $(dirname $JAVA_PATH))
echo "export JAVA_HOME=$JAVA_HOME" >> ~/.bashrc
echo "export PATH=\$JAVA_HOME/bin:\$PATH" >> ~/.bashrc
echo "export PYSPARK_PYTHON=python3" >> ~/.bashrc
echo "export PYSPARK_DRIVER_PYTHON=python3" >> ~/.bashrc
source ~/.bashrc
echo "[3/8] JAVA_HOME=$JAVA_HOME"

# ── [4/8] Pipeline venv + deps ──────────────
echo "[4/8] Setting up pipeline virtual environment..."
cd "$WORKSPACE/pipeline"
python3 -m venv venv
source venv/bin/activate
pip install --quiet -r requirements.txt
echo "[4/8] Pipeline venv ready."

# ── [5/8] PostgreSQL JDBC jar ───────────────
echo "[5/8] Installing PostgreSQL JDBC jar..."
PYSPARK_JARS=$(python3 -c "import pyspark, os; print(os.path.join(os.path.dirname(pyspark.__file__), 'jars'))")
curl -sL "https://jdbc.postgresql.org/download/postgresql-42.7.3.jar" -o "$PYSPARK_JARS/postgresql-42.7.3.jar"
sudo mkdir -p /usr/share/java
sudo cp "$PYSPARK_JARS/postgresql-42.7.3.jar" /usr/share/java/postgresql.jar
echo "[5/8] JDBC jar installed."

# ── [6/8] Generate data ──────────────────────
echo "[6/8] Generating good_data and bad_data CSVs..."
cd "$WORKSPACE/data"
pip install --quiet -r requirements.txt
python generate_data.py
cd "$WORKSPACE"
echo "[6/8] Data generated."

# ── [7/8] App env files + Node deps ─────────
echo "[7/8] Setting up app environment..."
[ -f "$WORKSPACE/app/.env" ]      || cp "$WORKSPACE/app/.env.example" "$WORKSPACE/app/.env"
[ -f "$WORKSPACE/pipeline/.env" ] || cp "$WORKSPACE/pipeline/.env.example" "$WORKSPACE/pipeline/.env"
sed -i 's/DB_PASSWORD=.*/DB_PASSWORD=fincore123/' "$WORKSPACE/pipeline/.env"
cd "$WORKSPACE/app" && npm install --silent
cd "$WORKSPACE/app/client" && npm install --silent
cd "$WORKSPACE"
echo "[7/8] App environment ready."

# ── [8/8] UC1 test deps ──────────────────────
echo "[8/8] Installing test dependencies..."
deactivate 2>/dev/null || true
pip install --quiet \
  pytest==7.4.4 \
  pytest-html==4.1.1 \
  great-expectations==0.18.15 \
  psycopg2-binary==2.9.9 \
  python-dotenv==1.0.0
echo "[8/8] Test dependencies ready."

echo ""
echo "======================================"
echo " Setup complete!"
echo ""
echo " To load data and start:"
echo "  cd pipeline && source venv/bin/activate"
echo "  JAVA_HOME=$JAVA_HOME PYSPARK_PYTHON=python3 python3 ingest.py good_data"
echo "  cd .. && bash start-app.sh"
echo "======================================"
