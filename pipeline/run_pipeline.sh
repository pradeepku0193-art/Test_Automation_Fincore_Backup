#!/bin/bash

###############################################################################
# FinCore Bank - Pipeline Execution Script
# 
# This script runs the PySpark data pipeline in LOCAL environment.
# For Docker and Jenkins, use run_pipeline_docker.sh and Jenkinsfile.
#
# Usage:
#   bash run_pipeline.sh good_data
#   bash run_pipeline.sh bad_data
#
# Prerequisites:
#   - Python 3.10+ with virtual environment activated
#   - PostgreSQL running and accessible
#   - Java JDK 11 or 17 installed
#   - .env file configured (copy from .env.example)
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Function to print colored messages
print_info() {
    echo -e "${BLUE}ℹ ${NC}$1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Function to print header
print_header() {
    echo ""
    echo "================================================================"
    echo "  FinCore Bank - Data Pipeline Execution (LOCAL)"
    echo "================================================================"
    echo ""
}

# Function to check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed"
        exit 1
    fi
    print_success "Python 3: $(python3 --version)"
    
    # Check Java
    if ! command -v java &> /dev/null; then
        print_error "Java is not installed (required for PySpark)"
        exit 1
    fi
    print_success "Java: $(java -version 2>&1 | head -n 1)"
    
    # Check if .env exists
    if [ ! -f "$SCRIPT_DIR/.env" ]; then
        print_warning ".env file not found, copying from .env.example"
        cp "$SCRIPT_DIR/.env.example" "$SCRIPT_DIR/.env"
        print_info "Please update .env with your database credentials"
    fi
    
    # Check if virtual environment is activated
    if [ -z "$VIRTUAL_ENV" ]; then
        print_warning "Virtual environment not activated"
        print_info "Attempting to activate venv..."
        
        if [ -d "$SCRIPT_DIR/venv" ]; then
            source "$SCRIPT_DIR/venv/bin/activate"
            print_success "Virtual environment activated"
        else
            print_error "Virtual environment not found at $SCRIPT_DIR/venv"
            print_info "Create one with: python3 -m venv venv"
            print_info "Then activate: source venv/bin/activate"
            print_info "And install deps: pip install -r requirements.txt"
            exit 1
        fi
    else
        print_success "Virtual environment: $VIRTUAL_ENV"
    fi
    
    # Check if required packages are installed
    if ! python3 -c "import pyspark" 2>/dev/null; then
        print_error "PySpark not installed"
        print_info "Install with: pip install -r requirements.txt"
        exit 1
    fi
    print_success "PySpark installed"
    
    echo ""
}

# Function to validate data folder argument
validate_data_folder() {
    local data_folder=$1
    
    if [ -z "$data_folder" ]; then
        print_error "Data folder not specified"
        echo ""
        echo "Usage: bash run_pipeline.sh <data_folder>"
        echo ""
        echo "Options:"
        echo "  good_data  - Run pipeline with clean data"
        echo "  bad_data   - Run pipeline with data quality violations"
        echo ""
        exit 1
    fi
    
    if [ "$data_folder" != "good_data" ] && [ "$data_folder" != "bad_data" ]; then
        print_error "Invalid data folder: $data_folder"
        echo ""
        echo "Valid options: good_data, bad_data"
        echo ""
        exit 1
    fi
    
    # Check if data folder exists
    local data_path="$PROJECT_ROOT/data/$data_folder"
    if [ ! -d "$data_path" ]; then
        print_error "Data folder not found: $data_path"
        exit 1
    fi
    
    # Check if CSV files exist
    local csv_files=("customers.csv" "accounts.csv" "transactions.csv" "loans.csv")
    for csv_file in "${csv_files[@]}"; do
        if [ ! -f "$data_path/$csv_file" ]; then
            print_error "CSV file not found: $data_path/$csv_file"
            exit 1
        fi
    done
    
    print_success "Data folder validated: $data_folder"
}

# Function to check database connectivity
check_database() {
    print_info "Checking database connectivity..."
    
    # Load environment variables
    source "$SCRIPT_DIR/.env"
    
    # Try to connect to PostgreSQL
    if command -v psql &> /dev/null; then
        if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" &> /dev/null; then
            print_success "Database connection successful"
        else
            print_error "Cannot connect to database"
            print_info "Check your .env configuration:"
            print_info "  DB_HOST=$DB_HOST"
            print_info "  DB_PORT=$DB_PORT"
            print_info "  DB_NAME=$DB_NAME"
            print_info "  DB_USER=$DB_USER"
            exit 1
        fi
    else
        print_warning "psql not found, skipping database connectivity check"
    fi
    
    echo ""
}

# Function to run the pipeline
run_pipeline() {
    local data_folder=$1
    
    print_info "Starting pipeline execution..."
    print_info "Data folder: $data_folder"
    echo ""
    
    # Change to pipeline directory
    cd "$SCRIPT_DIR"
    
    # Run the pipeline
    python3 ingest.py "$data_folder"
    
    local exit_code=$?
    
    echo ""
    if [ $exit_code -eq 0 ]; then
        print_success "Pipeline completed successfully!"
    else
        print_error "Pipeline failed with exit code: $exit_code"
        exit $exit_code
    fi
}

# Main execution
main() {
    print_header
    
    local data_folder=$1
    
    # Run checks
    check_prerequisites
    validate_data_folder "$data_folder"
    check_database
    
    # Run pipeline
    run_pipeline "$data_folder"
    
    echo ""
    echo "================================================================"
    echo "  Pipeline execution complete"
    echo "================================================================"
    echo ""
}

# Execute main function
main "$@"
