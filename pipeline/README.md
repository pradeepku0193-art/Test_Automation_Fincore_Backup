# FinCore Bank - PySpark Data Pipeline

This directory contains the PySpark data pipeline for ingesting and transforming banking data from CSV files into PostgreSQL.

## 📁 Directory Structure

```
pipeline/
├── ingest.py                 # Main PySpark ingestion script
├── transformations.py        # All transformation functions
├── run_pipeline.sh          # Execution script for LOCAL environment
├── run_pipeline_docker.sh   # Execution script for DOCKER environment
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variables template
├── .env                    # Your environment configuration (create from .env.example)
└── README.md               # This file
```

## 🚀 Quick Start

### Local Environment

```bash
# 1. Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 4. Run pipeline
bash run_pipeline.sh good_data
```

### Docker Environment

```bash
# 1. Ensure containers are running
docker compose up -d

# 2. Run pipeline
bash run_pipeline_docker.sh good_data
```

## 📋 Execution Scripts

### `run_pipeline.sh` - Local Execution

**Purpose**: Runs the pipeline on your local machine.

**Prerequisites**:
- Python 3.10+ installed
- Virtual environment activated
- PostgreSQL running locally
- Java JDK 11 or 17 installed
- `.env` file configured

**Usage**:
```bash
bash run_pipeline.sh <data_folder>

# Examples:
bash run_pipeline.sh good_data   # Clean data
bash run_pipeline.sh bad_data    # Data with violations
```

**Features**:
- ✅ Checks all prerequisites (Python, Java, venv, packages)
- ✅ Validates data folder and CSV files exist
- ✅ Tests database connectivity
- ✅ Provides colored output for easy reading
- ✅ Detailed error messages with solutions

**What it checks**:
1. Python 3 installation
2. Java installation (required for PySpark)
3. Virtual environment activation
4. PySpark package installation
5. `.env` file existence
6. Data folder and CSV files existence
7. Database connectivity

### `run_pipeline_docker.sh` - Docker Execution

**Purpose**: Runs the pipeline inside the Docker container.

**Prerequisites**:
- Docker and Docker Compose installed
- FinCore containers running (`docker compose up -d`)

**Usage**:
```bash
bash run_pipeline_docker.sh <data_folder>

# Examples:
bash run_pipeline_docker.sh good_data
bash run_pipeline_docker.sh bad_data
```

**Features**:
- ✅ Checks Docker daemon is running
- ✅ Verifies container is running
- ✅ Executes pipeline inside container
- ✅ Streams output to your terminal

**What it checks**:
1. Docker installation
2. Docker daemon running
3. `fincore-app` container is running
4. Valid data folder argument

## 🔧 Configuration

### Environment Variables (`.env`)

Create `.env` from `.env.example` and configure:

```env
# Database Configuration
DB_HOST=localhost              # Use 'postgres' for Docker
DB_PORT=5432
DB_NAME=fincore
DB_USER=admin
DB_PASSWORD=fincore123

# Spark Configuration
SPARK_DRIVER_MEMORY=4g
SPARK_EXECUTOR_MEMORY=4g
SPARK_APP_NAME=FinCore_Pipeline

# Pipeline Configuration
DATA_SOURCE_PATH=../data
LOG_LEVEL=INFO
```

**Important**: 
- For **local** execution: `DB_HOST=localhost`
- For **Docker** execution: `DB_HOST=postgres` (service name in docker-compose.yml)

## 📊 Data Folders

### `good_data/`
Clean data without violations:
- `customers.csv` - 10,000 records
- `accounts.csv` - 25,000 records
- `transactions.csv` - 500,000 records
- `loans.csv` - 8,000 records

### `bad_data/`
Data with intentional violations for testing Great Expectations:
- Same structure as good_data
- Contains NULL values, invalid statuses, future dates, etc.

## 🔄 Pipeline Flow

```
1. READ CSVs
   ├── customers.csv
   ├── accounts.csv
   ├── transactions.csv
   └── loans.csv

2. TRANSFORM
   ├── Trim whitespace
   ├── Standardize names (UPPERCASE)
   ├── Parse dates (DD/MM/YYYY → YYYY-MM-DD)
   ├── Map status codes (1→active, 2→inactive, 3→blocked)
   ├── Fill default currency (USD)
   ├── Compute loan duration (days)
   ├── Compute EMI (monthly installment)
   └── Remove duplicates

3. LOAD to PostgreSQL
   ├── customers table
   ├── accounts table
   ├── transactions table
   └── loans table
```

## 🛠️ Transformation Functions

All transformation functions are in `transformations.py`:

| Function | Purpose | Example |
|----------|---------|---------|
| `standardise_name` | Convert names to UPPERCASE | 'John Doe' → 'JOHN DOE' |
| `standardise_date` | Parse date strings to date type | '15/06/1985' → date(1985-06-15) |
| `compute_loan_duration` | Calculate days between dates | 7305 days |
| `compute_emi` | Calculate monthly installment | 2152.39 |
| `map_status_code` | Map codes to labels | 1 → 'active' |
| `fill_default_currency` | Fill NULL with default | NULL → 'USD' |
| `filter_zero_amounts` | Remove zero/negative amounts | amount > 0 |
| `trim_all_strings` | Remove whitespace | '  text  ' → 'text' |
| `remove_duplicates` | Remove duplicate rows | Based on key columns |

## 📝 Logging

The pipeline provides detailed logging:

```
2024-03-15 10:30:00 - INFO - Pipeline initialized for data folder: good_data
2024-03-15 10:30:05 - INFO - Reading CSV: /path/to/data/good_data/customers.csv
2024-03-15 10:30:10 - INFO - Loaded 10000 rows from customers.csv
2024-03-15 10:30:15 - INFO - Transforming customers data...
2024-03-15 10:30:20 - INFO - Customers transformation complete: 10000 rows
2024-03-15 10:30:25 - INFO - Writing 10000 rows to table: customers
2024-03-15 10:30:30 - INFO - ✓ customers: 10000 rows loaded
```

## 🧪 Testing Transformations

Transformation functions are designed to be unit tested in UC4:

```python
# Example test
from transformations import standardise_name
from pyspark.sql import SparkSession

spark = SparkSession.builder.getOrCreate()
df = spark.createDataFrame([("john doe",)], ["name"])
result = standardise_name(df, "name")
assert result.collect()[0][0] == "JOHN DOE"
```

## 🐛 Troubleshooting

### Issue: Java not found

**Error**: `Java is not installed (required for PySpark)`

**Solution**:
```bash
# macOS
brew install openjdk@17

# Linux
sudo apt install openjdk-17-jdk

# Verify
java -version
```

### Issue: Cannot connect to database

**Error**: `Cannot connect to database`

**Solution**:
1. Check PostgreSQL is running:
   ```bash
   # Local
   brew services list | grep postgresql  # macOS
   sudo systemctl status postgresql      # Linux
   
   # Docker
   docker ps | grep fincore-postgres
   ```

2. Verify `.env` configuration matches your setup

3. Test connection manually:
   ```bash
   psql -h localhost -U admin -d fincore
   ```

### Issue: PySpark not installed

**Error**: `PySpark not installed`

**Solution**:
```bash
# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Issue: CSV files not found

**Error**: `CSV file not found: /path/to/data/good_data/customers.csv`

**Solution**:
1. Ensure you've generated the datasets (see `data/README.md`)
2. Check the data folder exists: `ls -la ../data/good_data/`

### Issue: PostgreSQL JDBC driver not found

**Error**: `java.lang.ClassNotFoundException: org.postgresql.Driver`

**Solution**:
The script automatically handles this, but if issues persist:

```bash
# Download PostgreSQL JDBC driver
wget https://jdbc.postgresql.org/download/postgresql-42.6.0.jar

# Place in one of these locations:
# - /usr/share/java/postgresql.jar
# - /usr/local/share/java/postgresql.jar
# - ~/.m2/repository/org/postgresql/postgresql/42.6.0/
```

## 📈 Performance

### Recommended Resources

| Dataset Size | Driver Memory | Executor Memory | Execution Time |
|--------------|---------------|-----------------|----------------|
| good_data (543K rows) | 4g | 4g | ~2-3 minutes |
| bad_data (543K rows) | 4g | 4g | ~2-3 minutes |

### Optimization Tips

1. **Increase memory** for larger datasets:
   ```env
   SPARK_DRIVER_MEMORY=8g
   SPARK_EXECUTOR_MEMORY=8g
   ```

2. **Partition data** for parallel processing:
   ```python
   df = df.repartition(8)  # 8 partitions
   ```

3. **Cache** intermediate results:
   ```python
   df.cache()
   ```

## 🔐 Security

- ✅ Never commit `.env` file (included in `.gitignore`)
- ✅ Use environment variables for credentials
- ✅ Rotate database passwords regularly
- ✅ Use read-only database user for production pipelines

## 📚 Additional Resources

- [PySpark Documentation](https://spark.apache.org/docs/latest/api/python/)
- [PostgreSQL JDBC Driver](https://jdbc.postgresql.org/)
- [Great Expectations](https://docs.greatexpectations.io/)

---

**For Jenkins execution**, see `tests/Jenkinsfile` which orchestrates the full UC5 pipeline.
