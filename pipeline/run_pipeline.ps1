# FinCore Bank - PySpark Pipeline Execution Script (Windows PowerShell)
# This script runs the data pipeline locally on Windows

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("good_data", "bad_data")]
    [string]$DataFolder
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FinCore Bank - Data Pipeline (Windows)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "[1/5] Checking prerequisites..." -ForegroundColor Yellow

# Check Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "  ✓ Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Python not found. Please install Python 3.10+" -ForegroundColor Red
    exit 1
}

# Check Java
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "  ✓ Java: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Java not found. Please install Java JDK 11 or 17" -ForegroundColor Red
    exit 1
}

# Check virtual environment
Write-Host ""
Write-Host "[2/5] Setting up Python virtual environment..." -ForegroundColor Yellow

if (-Not (Test-Path "venv")) {
    Write-Host "  Creating virtual environment..." -ForegroundColor Gray
    python -m venv venv
}

# Activate virtual environment
Write-Host "  Activating virtual environment..." -ForegroundColor Gray
& ".\venv\Scripts\Activate.ps1"

# Install dependencies
Write-Host ""
Write-Host "[3/5] Installing Python dependencies..." -ForegroundColor Yellow
pip install -q -r requirements.txt
Write-Host "  ✓ Dependencies installed" -ForegroundColor Green

# Check data folder
Write-Host ""
Write-Host "[4/5] Validating data folder..." -ForegroundColor Yellow

$dataPath = Join-Path ".." "data" $DataFolder
if (-Not (Test-Path $dataPath)) {
    Write-Host "  ✗ Data folder not found: $dataPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please generate datasets first:" -ForegroundColor Yellow
    Write-Host "  cd data" -ForegroundColor Gray
    Write-Host "  pip install -r requirements.txt" -ForegroundColor Gray
    Write-Host "  python generate_data.py" -ForegroundColor Gray
    exit 1
}

Write-Host "  ✓ Data folder found: $dataPath" -ForegroundColor Green

# Check database connectivity
Write-Host ""
Write-Host "[5/5] Checking database connectivity..." -ForegroundColor Yellow

# Load .env if exists
if (Test-Path ".env") {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2])
        }
    }
}

$dbHost = if ($env:DB_HOST) { $env:DB_HOST } else { "localhost" }
$dbPort = if ($env:DB_PORT) { $env:DB_PORT } else { "5432" }

Write-Host "  Database: $dbHost`:$dbPort" -ForegroundColor Gray

# Run pipeline
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Running PySpark Pipeline" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$env:DATA_FOLDER = $DataFolder

python ingest.py

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✓ Pipeline completed successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ✗ Pipeline failed!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    exit 1
}
