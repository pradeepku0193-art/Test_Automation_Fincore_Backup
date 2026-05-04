#!/bin/bash
# No set -e — we handle errors per step

WORKSPACE="${CODESPACE_VSCODE_FOLDER:-/workspaces/$(ls /workspaces | head -1)}"
cd "$WORKSPACE"
echo "Workspace: $WORKSPACE"

echo "======================================"
echo " FinCore Bank — Codespace Setup"
echo "======================================"

# ── [1/8] Install PostgreSQL ─────────────────
echo ""
echo "[1/8] Installing PostgreSQL..."
sudo apt-get update -qq
sudo apt-get install -y -qq postgresql postgresql-client
echo "[1/8] DONE"

# ── [2/8] Configure PostgreSQL ───────────────
# KEY: start service FIRST, then find pg_hba via filesystem
# NOT via psql command (psql may not be ready yet)
echo ""
echo "[2/8] Configuring PostgreSQL..."
sudo service postgresql start
sleep 5

# Find pg_hba.conf via filesystem — works regardless of PG state
PG_HBA=$(find /etc/postgresql -name "pg_hba.conf" 2>/dev/null | head -1)
echo "  Found pg_hba.conf: $PG_HBA"

if [ -n "$PG_HBA" ]; then
  # Replace all auth methods with md5
  sudo sed -i 's/\bpeer\b/md5/g' "$PG_HBA"
  sudo sed -i 's/\bscram-sha-256\b/md5/g' "$PG_HBA"
  sudo sed -i 's/\btrust\b/md5/g' "$PG_HBA"
  sudo service postgresql restart
  sleep 5
  echo "  Auth updated to md5"
else
  echo "  WARNING: pg_hba.conf not found"
fi

# Create user and DB using postgres peer auth (always works locally)
sudo -u postgres psql -c "CREATE USER admin WITH PASSWORD 'fincore123' SUPERUSER;" 2>/dev/null \
  && echo "  User admin created" || echo "  User admin already exists"
sudo -u postgres psql -c "CREATE DATABASE fincore OWNER admin;" 2>/dev/null \
  && echo "  Database fincore created" || echo "  Database fincore already exists"

# Verify password auth works end-to-end
PGPASSWORD=fincore123 psql -h localhost -U admin -d fincore -c "SELECT 1;" >/dev/null 2>&1 \
  && echo "[2/8] DONE — connection verified" \
  || echo "[2/8] WARNING — connection check failed"

# ── [3/8] JAVA_HOME ──────────────────────────
# KEY: export directly in THIS shell process
# Do NOT rely on source ~/.bashrc — non-interactive shell ignores it
echo ""
echo "[3/8] Setting JAVA_HOME..."
JAVA_BIN=$(which java 2>/dev/null)
if [ -n "$JAVA_BIN" ]; then
  JAVA_REAL=$(readlink -f "$JAVA_BIN")
  export JAVA_HOME=$(dirname $(dirname "$JAVA_REAL"))
  export PATH="$JAVA_HOME/bin:$PATH"
  export PYSPARK_PYTHON=python3
  export PYSPARK_DRIVER_PYTHON=python3
  # Also persist for interactive sessions
  echo "export JAVA_HOME=$JAVA_HOME"       >> ~/.bashrc
  echo "export PATH=\$JAVA_HOME/bin:\$PATH" >> ~/.bashrc
  echo "export PYSPARK_PYTHON=python3"      >> ~/.bashrc
  echo "export PYSPARK_DRIVER_PYTHON=python3" >> ~/.bashrc
  echo "[3/8] DONE — JAVA_HOME=$JAVA_HOME"
  java -version 2>&1 | head -1
else
  echo "[3/8] WARNING — java not found in PATH"
fi

# ── [4/8] Pipeline venv + PySpark ────────────
# KEY: no --quiet — we need to see errors
# JAVA_HOME is already exported above in THIS shell
echo ""
echo "[4/8] Setting up pipeline virtual environment..."
echo "      PySpark ~300MB — expect 5-8 minutes"
cd "$WORKSPACE/pipeline"
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 -c "import pyspark; print('  PySpark import OK')" 2>/dev/null \
  && echo "[4/8] DONE" \
  || echo "[4/8] WARNING — PySpark not importable"
cd "$WORKSPACE"

# ── [5/8] PostgreSQL JDBC jar ────────────────
echo ""
echo "[5/8] Installing PostgreSQL JDBC jar..."
PYSPARK_JARS=$(python3 -c \
  "import pyspark, os; print(os.path.join(os.path.dirname(pyspark.__file__), 'jars'))" \
  2>/dev/null)
if [ -n "$PYSPARK_JARS" ]; then
  curl -sL "https://jdbc.postgresql.org/download/postgresql-42.7.3.jar" \
    -o "$PYSPARK_JARS/postgresql-42.7.3.jar"
  sudo mkdir -p /usr/share/java
  sudo cp "$PYSPARK_JARS/postgresql-42.7.3.jar" /usr/share/java/postgresql.jar
  echo "[5/8] DONE — jar at /usr/share/java/postgresql.jar"
else
  echo "[5/8] WARNING — could not find PySpark jars directory"
fi

# ── [6/8] Generate data ──────────────────────
echo ""
echo "[6/8] Generating good_data and bad_data CSVs..."
cd "$WORKSPACE/data"
pip install -q -r requirements.txt
python3 generate_data.py
cd "$WORKSPACE"
echo "[6/8] DONE"

# ── [7/8] App env files + Node deps ──────────
echo ""
echo "[7/8] Setting up app environment..."
[ -f "$WORKSPACE/app/.env" ]      || cp "$WORKSPACE/app/.env.example"      "$WORKSPACE/app/.env"
[ -f "$WORKSPACE/pipeline/.env" ] || cp "$WORKSPACE/pipeline/.env.example" "$WORKSPACE/pipeline/.env"
# Ensure DB password is set correctly
sed -i 's/DB_PASSWORD=.*/DB_PASSWORD=fincore123/' "$WORKSPACE/pipeline/.env"
cd "$WORKSPACE/app"        && npm install --silent
cd "$WORKSPACE/app/client" && npm install --silent
cd "$WORKSPACE"
echo "[7/8] DONE"

# ── [8/8] UC1 test deps ──────────────────────
echo ""
echo "[8/8] Installing UC1 test dependencies..."
deactivate 2>/dev/null || true
pip install \
  pytest==7.4.4 \
  pytest-html==4.1.1 \
  "great-expectations==0.18.15" \
  psycopg2-binary==2.9.9 \
  python-dotenv==1.0.0
pip show great-expectations 2>/dev/null | grep "Version" \
  && echo "[8/8] DONE" \
  || echo "[8/8] WARNING — great-expectations not found"

echo ""
echo "======================================"
echo " Setup complete!"
echo ""
echo " Load data:"
echo "   cd pipeline && source venv/bin/activate"
echo "   JAVA_HOME=$JAVA_HOME PYSPARK_PYTHON=python3 python3 ingest.py good_data"
echo "======================================"
