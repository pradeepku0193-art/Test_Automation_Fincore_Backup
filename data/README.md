# FinCore Bank - Datasets

This directory contains CSV datasets for the FinCore Bank system.

## 📁 Directory Structure

```
data/
├── generate_data.py      # Dataset generation script
├── requirements.txt       # Python dependencies
├── good_data/            # Clean datasets (generated)
│   ├── customers.csv
│   ├── accounts.csv
│   ├── transactions.csv
│   └── loans.csv
└── bad_data/             # Datasets with violations (generated)
    ├── customers.csv
    ├── accounts.csv
    ├── transactions.csv
    └── loans.csv
```

## 🚀 Quick Start

### Generate Datasets

```bash
# Install dependencies
pip install -r requirements.txt

# Generate both good_data and bad_data
python generate_data.py
```

This will create:
- **good_data/** - 543,000 clean records
- **bad_data/** - 543,000 records with intentional violations

## 📊 Dataset Specifications

### good_data (Clean Data)

| File | Records | Description |
|------|---------|-------------|
| customers.csv | 10,000 | Customer master data |
| accounts.csv | 25,000 | Bank accounts |
| transactions.csv | 500,000 | Transaction history |
| loans.csv | 8,000 | Loan records |
| **Total** | **543,000** | |

**Characteristics**:
- ✅ All fields valid
- ✅ No NULL values in required fields
- ✅ All dates in correct format
- ✅ All foreign keys valid
- ✅ All constraints satisfied

### bad_data (Data with Violations)

Same volume as good_data but with **intentional data quality issues** for testing Great Expectations.

**Violations Introduced**:

#### customers.csv
- **50 records**: NULL emails
- **30 records**: Invalid status codes (4, 5, 99 instead of 1, 2, 3)
- **20 records**: Future date of birth

#### accounts.csv
- **40 records**: Negative balances on savings accounts
- **25 records**: Invalid account types (checking, investment, loan)

#### transactions.csv
- **200 records**: Negative amounts
- **150 records**: Future transaction dates
- **100 records**: Orphaned account_ids (non-existent accounts)
- **80 records**: Duplicate reference_ids

#### loans.csv
- **35 records**: Invalid interest rates (>95%)
- **25 records**: end_date before start_date
- **45 records**: NULL outstanding_amount

## 📝 CSV File Formats

### customers.csv

```csv
id,name,email,phone,address,date_of_birth,status_code,created_date,kyc_verified
1,John Doe,john.doe@email.com,+1-555-0100,123 Main St,15/06/1985,1,2023-01-15 10:30:00,True
```

**Columns**:
- `id` - Integer, primary key
- `name` - String, customer full name
- `email` - String, email address
- `phone` - String, phone number
- `address` - String, full address
- `date_of_birth` - String, format: DD/MM/YYYY
- `status_code` - Integer, 1=active, 2=inactive, 3=blocked
- `created_date` - String, format: YYYY-MM-DD HH:MM:SS
- `kyc_verified` - Boolean, True/False

### accounts.csv

```csv
id,customer_id,account_number,account_type,balance,currency,status,opened_date
1,1,ACC0000000001,savings,5000.00,USD,active,2023-01-15
```

**Columns**:
- `id` - Integer, primary key
- `customer_id` - Integer, foreign key to customers
- `account_number` - String, unique account number
- `account_type` - String, savings/current/fixed_deposit
- `balance` - Decimal, account balance
- `currency` - String, USD/EUR/GBP (can be NULL)
- `status` - String, active/dormant/closed
- `opened_date` - String, format: YYYY-MM-DD

### transactions.csv

```csv
id,account_id,transaction_type,amount,currency,transaction_date,description,status,reference_id
1,1,credit,1000.00,USD,2024-01-15 14:30:00,Salary deposit,completed,TXN000000000001
```

**Columns**:
- `id` - Integer, primary key
- `account_id` - Integer, foreign key to accounts
- `transaction_type` - String, credit/debit/transfer
- `amount` - Decimal, transaction amount
- `currency` - String, USD/EUR/GBP
- `transaction_date` - String, format: YYYY-MM-DD HH:MM:SS
- `description` - String, transaction description
- `status` - String, completed/pending/failed/reversed
- `reference_id` - String, unique reference

### loans.csv

```csv
id,customer_id,loan_type,principal_amount,outstanding_amount,interest_rate,start_date,end_date,status
1,1,home,250000.00,200000.00,8.50,01/01/2023,01/01/2043,active
```

**Columns**:
- `id` - Integer, primary key
- `customer_id` - Integer, foreign key to customers
- `loan_type` - String, home/personal/auto/education
- `principal_amount` - Decimal, original loan amount
- `outstanding_amount` - Decimal, remaining amount
- `interest_rate` - Decimal, annual interest rate %
- `start_date` - String, format: DD/MM/YYYY
- `end_date` - String, format: DD/MM/YYYY
- `status` - String, active/closed/defaulted/restructured

## 🔄 Using the Datasets

### Load to Database

```bash
# Load good data
bash pipeline/run_pipeline.sh good_data

# Load bad data (for testing)
bash pipeline/run_pipeline.sh bad_data
```

### Verify Data

```bash
# Check record counts
psql -U admin -d fincore -c "SELECT 
  (SELECT COUNT(*) FROM customers) as customers,
  (SELECT COUNT(*) FROM accounts) as accounts,
  (SELECT COUNT(*) FROM transactions) as transactions,
  (SELECT COUNT(*) FROM loans) as loans;"
```

Expected output:
```
 customers | accounts | transactions | loans 
-----------+----------+--------------+-------
     10000 |    25000 |       500000 |  8000
```

## 🧪 Testing with bad_data

The bad_data is specifically designed for **UC1: Data Quality Validation** with Great Expectations.

**Example Great Expectations tests**:
```python
# Test for NULL emails
expect_column_values_to_not_be_null(column="email")

# Test for valid status codes
expect_column_values_to_be_in_set(column="status_code", value_set=[1, 2, 3])

# Test for future dates
expect_column_values_to_be_between(
    column="date_of_birth",
    min_value="1900-01-01",
    max_value=datetime.now()
)
```

## 📈 Data Distribution

### Customers by Status
- Active: ~80%
- Inactive: ~15%
- Blocked: ~5%

### Accounts by Type
- Savings: ~40%
- Current: ~35%
- Fixed Deposit: ~25%

### Transactions by Type
- Credit: ~33%
- Debit: ~33%
- Transfer: ~34%

### Loans by Type
- Home: ~30%
- Personal: ~30%
- Auto: ~25%
- Education: ~15%

## 🔧 Customization

To modify dataset sizes, edit `generate_data.py`:

```python
NUM_CUSTOMERS = 10000      # Change to desired count
NUM_ACCOUNTS = 25000
NUM_TRANSACTIONS = 500000
NUM_LOANS = 8000
```

Then regenerate:
```bash
python generate_data.py
```

## 🐛 Troubleshooting

### Issue: Faker not installed

**Error**: `ModuleNotFoundError: No module named 'faker'`

**Solution**:
```bash
pip install -r requirements.txt
```

### Issue: Permission denied

**Error**: `PermissionError: [Errno 13] Permission denied`

**Solution**:
```bash
chmod +w good_data bad_data
```

### Issue: CSV encoding errors

**Solution**: The script uses UTF-8 encoding. Ensure your system supports it.

## 📚 Additional Resources

- [Faker Documentation](https://faker.readthedocs.io/)
- [CSV Format Specification](https://tools.ietf.org/html/rfc4180)
- [Great Expectations](https://docs.greatexpectations.io/)

---

**Generated with**: Python 3.10+, Faker 22.0.0
