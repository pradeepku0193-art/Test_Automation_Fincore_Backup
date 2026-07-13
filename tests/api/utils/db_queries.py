CUSTOMER_COUNT = """
SELECT COUNT(*) AS customer_count
FROM public.customers
"""

ACTIVE_CUSTOMER_COUNT = """
SELECT COUNT(*) AS active_customer_count
FROM public.customers
WHERE status='active'
"""

TRANSACTION_COUNT = """
SELECT COUNT(*) AS transaction_count
FROM public.transactions
"""

ACTIVE_LOAN_COUNT = """
SELECT COUNT(*) AS active_loan_count
FROM public.loans
WHERE status='active'
"""

CUSTOMER_BY_ID = """
SELECT id,email, status
FROM public.customers
WHERE id = 5959
"""

TRANSACTION_BY_ID = """
SELECT COUNT(*) AS cnt
FROM dbo.transactions
WHERE account_id = 5
"""

LOAN_BY_ID = """
SELECT id, customer_id, amount, status
FROM public.loans
WHERE id = %s
"""

DASHBOARD_SUMMARY = """
SELECT
    (SELECT COUNT(*) FROM public.customers) AS total_customers,
    (SELECT COUNT(*) FROM public.loans WHERE status='active') AS active_loans
"""