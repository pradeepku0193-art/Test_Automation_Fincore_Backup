/**
 * Dashboard Routes
 */

const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Get dashboard summary statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_customers:
 *                   type: integer
 *                 active_accounts:
 *                   type: integer
 *                 transactions_today:
 *                   type: integer
 *                 active_loans:
 *                   type: integer
 */
router.get('/summary', asyncHandler(async (req, res) => {
    // Total customers
    const customersResult = await query('SELECT COUNT(*) as count FROM customers');
    const total_customers = parseInt(customersResult.rows[0].count);
    
    // Active accounts
    const accountsResult = await query("SELECT COUNT(*) as count FROM accounts WHERE status = 'active'");
    const active_accounts = parseInt(accountsResult.rows[0].count);
    
    // Transactions today
    const transactionsResult = await query(
        "SELECT COUNT(*) as count FROM transactions WHERE DATE(transaction_date) = CURRENT_DATE"
    );
    const transactions_today = parseInt(transactionsResult.rows[0].count);
    
    // Active loans
    const loansResult = await query("SELECT COUNT(*) as count FROM loans WHERE status = 'active'");
    const active_loans = parseInt(loansResult.rows[0].count);
    
    res.json({
        total_customers,
        active_accounts,
        transactions_today,
        active_loans,
        queries_used: {
            total_customers: 'SELECT COUNT(*) FROM customers',
            active_accounts: "SELECT COUNT(*) FROM accounts WHERE status='active'",
            transactions_today: "SELECT COUNT(*) FROM transactions WHERE DATE(transaction_date)=CURRENT_DATE",
            active_loans: "SELECT COUNT(*) FROM loans WHERE status='active'"
        }
    });
}));

/**
 * @swagger
 * /dashboard/transactions-by-day:
 *   get:
 *     summary: Get transaction counts by day (last 30 days)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transaction counts by day
 */
router.get('/transactions-by-day', asyncHandler(async (req, res) => {
    const transactionsQuery = `
        SELECT DATE(transaction_date) as date, COUNT(*) as count
        FROM transactions
        WHERE transaction_date >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE(transaction_date)
        ORDER BY date ASC
    `;
    const result = await query(transactionsQuery);
    
    res.json({
        data: result.rows
    });
}));

/**
 * @swagger
 * /dashboard/loan-status-distribution:
 *   get:
 *     summary: Get loan count by status
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Loan status distribution
 */
router.get('/loan-status-distribution', asyncHandler(async (req, res) => {
    const loansQuery = `
        SELECT status, COUNT(*) as count
        FROM loans
        GROUP BY status
        ORDER BY count DESC
    `;
    const result = await query(loansQuery);
    
    res.json({
        data: result.rows
    });
}));

module.exports = router;
