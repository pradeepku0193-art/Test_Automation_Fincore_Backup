#!/bin/bash

###############################################################################
# FinCore Bank - Pipeline Execution Script for DOCKER
# 
# This script runs the PySpark data pipeline inside Docker container.
#
# Usage:
#   bash run_pipeline_docker.sh good_data
#   bash run_pipeline_docker.sh bad_data
#
# Prerequisites:
#   - Docker and Docker Compose installed
#   - FinCore containers running (docker compose up -d)
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Container name
CONTAINER_NAME="fincore-app"

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
    echo "  FinCore Bank - Data Pipeline Execution (DOCKER)"
    echo "================================================================"
    echo ""
}

# Function to check if Docker is running
check_docker() {
    print_info "Checking Docker..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running"
        print_info "Start Docker Desktop and try again"
        exit 1
    fi
    
    print_success "Docker is running"
}

# Function to check if container is running
check_container() {
    print_info "Checking container status..."
    
    if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        print_error "Container '$CONTAINER_NAME' is not running"
        print_info "Start containers with: docker compose up -d"
        exit 1
    fi
    
    print_success "Container '$CONTAINER_NAME' is running"
}

# Function to validate data folder argument
validate_data_folder() {
    local data_folder=$1
    
    if [ -z "$data_folder" ]; then
        print_error "Data folder not specified"
        echo ""
        echo "Usage: bash run_pipeline_docker.sh <data_folder>"
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
    
    print_success "Data folder validated: $data_folder"
}

# Function to run the pipeline in Docker
run_pipeline() {
    local data_folder=$1
    
    print_info "Executing pipeline in Docker container..."
    print_info "Data folder: $data_folder"
    echo ""
    
    # Execute the pipeline inside the container
    docker exec -it "$CONTAINER_NAME" bash -c "cd /app/pipeline && python3 ingest.py $data_folder"
    
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
    check_docker
    check_container
    validate_data_folder "$data_folder"
    
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
