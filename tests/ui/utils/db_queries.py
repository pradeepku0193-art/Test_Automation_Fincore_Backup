TOTAL_CUSTOMERS = """
SELECT COUNT(*) AS total_customers
FROM customers
"""

ACTIVE_ACCOUNTS = """
SELECT COUNT(*) AS active_accounts
FROM accounts
WHERE status='active'
"""

ACTIVE_LOANS = """
SELECT COUNT(*) AS active_loans
FROM loans
WHERE status='active'
"""