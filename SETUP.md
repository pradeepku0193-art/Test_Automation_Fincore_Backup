# FinCore Bank - Local Setup Guide

This guide provides instructions for running FinCore Bank on your local machine **without Docker**.

Important:
- Trainees are expected to self-install prerequisites using official documentation.
- OS-specific installation support is intentionally not provided to avoid environment troubleshooting overhead.
- For a consolidated local run, see README "Option 0: No‑Docker Quickstart" and the unified scripts `start-app.sh` (Linux/macOS) or `start-app.ps1` (Windows).

## Table of Contents
- [Prerequisites (Self-Install)](#prerequisites-self-install)
- [Database Setup](#database-setup)
- [Backend API Setup](#backend-api-setup)
- [Frontend UI Setup](#frontend-ui-setup)
- [Pipeline Setup](#pipeline-setup)
- [Running the System](#running-the-system)
- [Verification](#verification)
- [Common Issues](#common-issues)

---

## Prerequisites (Self-Install)

Install the following on your own using official guides. Environment setup support is out of scope for this training; please use your preferred package manager or installers.

- Python 3.10+ (required for PySpark)
  - Official: https://www.python.org/downloads/
- Node.js 20.x LTS + npm
  - Official: https://nodejs.org/
- PostgreSQL 15.x
  - Official: https://www.postgresql.org/download/
- Java JDK 11 or 17 (required by PySpark)
  - Official: https://adoptium.net/ or https://www.oracle.com/java/technologies/downloads/
- Git 2.x
  - Official: https://git-scm.com/downloads

Optional validation commands (run if you wish to verify versions): `python --version`, `node --version`, `npm --version`, `psql --version`, `java -version`, `git --version`.

---

## Database Setup

### 1. Create Database and User

#### macOS/Linux
```bash
# Switch to postgres user (Linux only)
sudo -u postgres psql

# Or directly connect (macOS)
psql postgres

# Run these SQL commands:
CREATE DATABASE fincore;
CREATE USER admin WITH PASSWORD 'fincore123';
GRANT ALL PRIVILEGES ON DATABASE fincore TO admin;
\q
```

#### Windows
```bash
# Open psql from Start Menu or Command Prompt
psql -U postgres

# Run the same SQL commands as above
```

### 2. Initialize Schema

```bash
# Navigate to project directory
cd /path/to/fincore-bank

# Run initialization script
psql -U admin -d fincore -f db/init.sql
```

### 3. Verify Database

```bash
psql -U admin -d fincore -c "\dt"
```

You should see tables: `customers`, `accounts`, `transactions`, `loans`

---

## Backend API Setup

### 1. Navigate to App Directory
```bash
cd app
```

### 2. Install Dependencies
```bash
npm install
```

This installs:
- express
- pg (PostgreSQL client)
- jsonwebtoken
- bcrypt
- cors
- swagger-jsdoc
- swagger-ui-express
- dotenv

### 3. Create Environment File

Create `app/.env`:
```env
# Database Configuration
DATABASE_URL=postgresql://admin:fincore123@localhost:5432/fincore
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fincore
DB_USER=admin
DB_PASSWORD=fincore123

# JWT Configuration
JWT_SECRET=fincore_jwt_secret_2024
JWT_EXPIRES_IN=24h

# Server Configuration
NODE_ENV=development
API_PORT=4000
UI_PORT=3000

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 4. Test API Connection
```bash
# Start the API server
npm run dev

# In another terminal, test health endpoint
curl http://localhost:4000/api/v1/health
```

---

## Frontend UI Setup

### 1. Navigate to Client Directory
```bash
cd app/client
```

### 2. Install Dependencies
```bash
npm install
```

This installs:
- react
- react-dom
- react-router-dom
- axios
- recharts (for charts)
- tailwindcss
- @headlessui/react

### 3. Create Environment File

Create `app/client/.env`:
```env
VITE_API_URL=http://localhost:4000/api/v1
```

### 4. Start UI (Development)
```bash
npm run dev
```

---

## Pipeline Setup

### 1. Navigate to Pipeline Directory
```bash
cd pipeline
```

### 2. Create Virtual Environment
```bash
# Create venv
python3 -m venv venv

# Activate venv
# macOS/Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

### 3. Install Python Dependencies
```bash
pip install -r requirements.txt
```

This installs:
- pyspark==3.4.1
- psycopg2-binary==2.9.9
- python-dotenv==1.0.0

### 4. Create Environment File

Create `pipeline/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fincore
DB_USER=admin
DB_PASSWORD=fincore123
SPARK_DRIVER_MEMORY=4g
SPARK_EXECUTOR_MEMORY=4g
```

### 5. Make Script Executable
```bash
chmod +x run_pipeline.sh
```

### 6. Test Pipeline
```bash
# Run with good data
bash run_pipeline.sh good_data

# Expected output:
# Starting FinCore Bank Data Pipeline...
# Reading CSVs from data/good_data/...
# ✓ customers: 10,000 rows loaded
# ✓ accounts: 25,000 rows loaded
# ✓ transactions: 500,000 rows loaded
# ✓ loans: 8,000 rows loaded
```

---

## Running the System

### Terminal 1: PostgreSQL
```bash
# Should already be running from setup
# Check status:
# macOS:
brew services list | grep postgresql

# Linux:
sudo systemctl status postgresql
```

### Terminal 2: Backend API
```bash
cd app
npm run dev

# API will start on http://localhost:4000
```

### Terminal 3: Frontend UI
```bash
cd app/client
npm start

# UI will start on http://localhost:3000
```

### Terminal 4: Pipeline (when needed)
```bash
cd pipeline
source venv/bin/activate  # Activate venv first
bash run_pipeline.sh good_data
```

---

## Verification

### 1. Check Database
```bash
psql -U admin -d fincore -c "SELECT COUNT(*) FROM customers;"
# Expected: 10000
```

### 2. Check API
```bash
curl http://localhost:4000/api/v1/health
# Expected: {"status":"ok","db":"connected",...}
```

### 3. Check UI
Open browser: http://localhost:3000
- Login with: `admin` / `Admin@123`
- You should see the dark-themed dashboard

### 4. Check Swagger
Open browser: http://localhost:4000/api/docs
- Interactive API documentation should load

---

## Common Issues

### Issue: Port Already in Use

**Error**: `EADDRINUSE: address already in use :::4000`

**Solution**:
```bash
# Find process using the port
lsof -i :4000

# Kill the process
kill -9 <PID>
```

### Issue: PostgreSQL Connection Failed

**Error**: `ECONNREFUSED` or `password authentication failed`

**Solution**:
```bash
# Check PostgreSQL is running
# macOS:
brew services list

# Linux:
sudo systemctl status postgresql

# Restart if needed
brew services restart postgresql@15  # macOS
sudo systemctl restart postgresql    # Linux

# Verify credentials in .env match database
```

### Issue: PySpark Java Error

**Error**: `JAVA_HOME is not set`

**Solution**:
```bash
# macOS:
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc

# Linux:
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc

# Verify
echo $JAVA_HOME
java -version
```

### Issue: Python Module Not Found

**Error**: `ModuleNotFoundError: No module named 'pyspark'`

**Solution**:
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Reinstall requirements
pip install -r requirements.txt
```

### Issue: npm Install Fails

**Error**: Various npm errors

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: React Build Fails

**Error**: Memory errors during build

**Solution**:
```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"

# Retry build
npm run build
```

### Issue: Database Tables Not Created

**Error**: Tables don't exist after running init.sql

**Solution**:
```bash
# Check if init.sql ran successfully
psql -U admin -d fincore -c "\dt"

# If no tables, manually run:
psql -U admin -d fincore -f db/init.sql

# Check for errors in output
```

---

## Environment Variables Reference

### Backend API (.env)
| Variable | Default | Description |
|----------|---------|-------------|
| DATABASE_URL | postgresql://admin:fincore123@localhost:5432/fincore | Full database connection string |
| DB_HOST | localhost | Database host |
| DB_PORT | 5432 | Database port |
| DB_NAME | fincore | Database name |
| DB_USER | admin | Database user |
| DB_PASSWORD | fincore123 | Database password |
| JWT_SECRET | fincore_jwt_secret_2024 | JWT signing secret |
| JWT_EXPIRES_IN | 24h | JWT expiration time |
| NODE_ENV | development | Environment mode |
| API_PORT | 4000 | API server port |
| CORS_ORIGIN | http://localhost:3000 | Allowed CORS origin |

### Frontend UI (.env)
| Variable | Default | Description |
|----------|---------|-------------|
| REACT_APP_API_URL | http://localhost:4000/api/v1 | Backend API URL |
| REACT_APP_ENV | development | Environment mode |

### Pipeline (.env)
| Variable | Default | Description |
|----------|---------|-------------|
| DB_HOST | localhost | Database host |
| DB_PORT | 5432 | Database port |
| DB_NAME | fincore | Database name |
| DB_USER | admin | Database user |
| DB_PASSWORD | fincore123 | Database password |
| SPARK_DRIVER_MEMORY | 4g | Spark driver memory |
| SPARK_EXECUTOR_MEMORY | 4g | Spark executor memory |

---

## Next Steps

1. ✅ System is running locally
2. 📊 Run the pipeline: `bash pipeline/run_pipeline.sh good_data`
3. 🌐 Access UI: http://localhost:3000
4. 📚 Explore API: http://localhost:4000/api/docs
5. 🧪 Run tests: See [tests/README.md](tests/README.md)

For architecture details and advanced configuration, see [comprehensive-guide.md](comprehensive-guide.md).
