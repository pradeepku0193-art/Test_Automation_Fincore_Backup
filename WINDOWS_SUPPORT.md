# Windows Support & Cross-Platform Guide

## ✅ Complete Windows Support Added

FinCore Bank now has **full Windows support** with PowerShell scripts and cross-platform instructions.

## 📁 New Files Created

### Windows PowerShell Scripts
1. **`pipeline/run_pipeline.ps1`** - Pipeline execution for Windows
2. **`start-app.ps1`** - Unified startup script for Windows

### Linux/macOS Scripts
1. **`start-app.sh`** - Unified startup script for Linux/macOS

## 🚀 Quick Start (Windows)

```powershell
# 1) Generate datasets
cd data
pip install -r requirements.txt
python generate_data.py
cd ..

# 2) Load data to local PostgreSQL
cd pipeline
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
.\run_pipeline.ps1 good_data
cd ..

# 3) Start both Backend + Frontend
.\start-app.ps1
```

## 🚀 Quick Start (Linux/macOS)

```bash
# 1) Generate datasets
cd data && pip install -r requirements.txt && python generate_data.py && cd -

# 2) Load data to local PostgreSQL
cd pipeline && python3 -m venv venv && source venv/bin/activate \
  && pip install -r requirements.txt && bash run_pipeline.sh good_data && cd -

# 3) Start both Backend + Frontend
bash start-app.sh
```

## 📋 README Updates

### 1. Explicit Local/No-Docker Support
- ✅ "Option 0: No‑Docker Quickstart" with Windows and Linux/macOS instructions
- ✅ Clear mention: "NO DOCKER - runs on your laptop"
- ✅ Pipeline section explicitly states "Runs on Your Laptop"

### 2. Windows Support
- ✅ All commands have Windows (PowerShell) and Linux/macOS versions
- ✅ PowerShell scripts for pipeline execution
- ✅ PowerShell script for unified app startup

### 3. Port Configuration Guide
- ✅ Table showing which files to edit for each port
- ✅ Step-by-step example for changing API port
- ✅ Clear mapping of environment variables

### 4. "What to Ignore" Section
- ✅ Clear list of infrastructure files trainees can ignore
- ✅ Configuration files that are already set up
- ✅ Focus areas for training (tests/, data/, transformations)
- ✅ Main task: Write tests, not modify app code

### 5. Unified Startup Scripts
- ✅ Single command to start both Backend + Frontend
- ✅ Verbose output with icons (🚀, ✓, 🌐, etc.)
- ✅ Auto-installs dependencies
- ✅ Creates .env files automatically
- ✅ Logs to files (logs/backend.log, logs/frontend.log)
- ✅ Single Ctrl+C stops everything

## 🔧 Port Configuration

| Component | File | Variable | Default |
|-----------|------|----------|---------|
| Backend API | `app/.env` | `API_PORT` | 4000 |
| Frontend UI | `app/client/.env` | `VITE_API_URL` | http://localhost:4000/api/v1 |
| Frontend UI | `app/client/vite.config.js` | `server.port` | 3000 |
| PostgreSQL | `app/.env` | `DB_PORT` | 5432 |
| PostgreSQL | `pipeline/.env` | `DB_PORT` | 5432 |

## 🎓 For Trainees

### ❌ Don't Waste Time On
- `.github/` - CI/CD (already configured)
- `docker-compose.yml` - Docker setup
- `Dockerfile` - Container build
- `package-lock.json`, `node_modules/`, `venv/` - Dependencies
- `app/src/config/database.js` - DB connection
- `app/src/utils/swagger.js` - API docs
- Config files (vite.config.js, tailwind.config.js)

### ✅ Focus On
- **`tests/`** - Write test automation (UC1-UC5)
- **`data/`** - Understand good_data vs bad_data
- **`pipeline/transformations.py`** - Study PySpark transformations
- **API endpoints** - Test via Swagger UI
- **UI screens** - Automate via browser

## 📝 Script Features

### Pipeline Scripts (run_pipeline.sh / run_pipeline.ps1)
- ✅ Checks Python, Java prerequisites
- ✅ Creates/activates virtual environment
- ✅ Installs dependencies
- ✅ Validates data folder exists
- ✅ Checks database connectivity
- ✅ Colored output (Green ✓, Red ✗, Yellow warnings)
- ✅ Verbose progress indicators

### Startup Scripts (start-app.sh / start-app.ps1)
- ✅ Checks Node.js, npm prerequisites
- ✅ Auto-installs backend dependencies
- ✅ Auto-installs frontend dependencies
- ✅ Creates .env files from templates
- ✅ Starts both services concurrently
- ✅ Icons: 🚀 (startup), ✓ (success), 🌐 (URLs), 🗄️ (database)
- ✅ Logs to files for debugging
- ✅ Single Ctrl+C stops all services

## 🌐 URLs After Startup

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend UI | http://localhost:3000 | Web Portal |
| Backend API | http://localhost:4000/api/v1 | REST API |
| Swagger Docs | http://localhost:4000/api/docs | API Documentation |

## 🔐 Test Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | Admin@123 | Full access |
| viewer | Viewer@123 | Read-only |
| testuser | Test@123 | Standard |

## 📚 Documentation Structure

```
README.md
├── Option 0: No-Docker Quickstart (Windows/Linux/macOS)
├── Option 1: Docker (Recommended)
├── Option 2: Local Setup (detailed)
├── Service Ports
├── Port Configuration Guide ⭐ NEW
├── For Trainees: What to Ignore ⭐ NEW
├── Default Credentials
├── Dataset Information
├── Running the Pipeline (Windows/Linux/macOS) ⭐ UPDATED
├── Verifying the System
├── Starting Backend + Frontend Together ⭐ NEW
├── Running Tests
└── Troubleshooting
```

## ✅ Summary of Changes

1. **Windows Support**: Full PowerShell scripts for all operations
2. **Explicit Local/No-Docker**: Clear mentions throughout README
3. **Port Configuration**: Complete guide with examples
4. **What to Ignore**: Helps trainees focus on relevant files
5. **Unified Startup**: Single script for both services with verbose output
6. **Cross-Platform**: All commands have Windows and Linux/macOS versions

---

**Result**: Trainees can now use FinCore Bank on **Windows, macOS, or Linux** with or without Docker, with clear guidance on what to focus on and how to configure ports.
