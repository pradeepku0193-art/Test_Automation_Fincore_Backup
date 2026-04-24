/**
 * Transactions Routes
 */

const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { validatePagination, validateDateRange, validateAmountRange } = require('../middleware/validator');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions with filters
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: account_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [credit, debit, transfer]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [completed, pending, failed, reversed]
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: min_amount
 *         schema:
 *           type: number
 *       - in: query
 *         name: max_amount
 *         schema:
 *           type: number
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Paginated transaction list
 */
router.get('/', validatePagination, validateDateRange, validateAmountRange, asyncHandler(async (req, res) => {
    const { page, limit, offset } = req.pagination;
    const { account_id, type, status, from_date, to_date, min_amount, max_amount } = req.query;
    
    const conditions = [];
    const params = [];
    let paramIndex = 1;
    
    if (account_id) {
        conditions.push(`t.account_id = $${paramIndex++}`);
        params.push(account_id);
    }
    
    if (type) {
        conditions.push(`t.transaction_type = $${paramIndex++}`);
        params.push(type);
    }
    
    if (status) {
        conditions.push(`t.status = $${paramIndex++}`);
        params.push(status);
    }
    
    if (from_date) {
        conditions.push(`t.transaction_date >= $${paramIndex++}`);
        params.push(from_date);
    }
    
    if (to_date) {
        conditions.push(`t.transaction_date <= $${paramIndex++}`);
        params.push(to_date);
    }
    
    if (min_amount) {
        conditions.push(`t.amount >= $${paramIndex++}`);
        params.push(min_amount);
    }
    
    if (max_amount) {
        conditions.push(`t.amount <= $${paramIndex++}`);
        params.push(max_amount);
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    const countQuery = `SELECT COUNT(*) FROM transactions t ${whereClause}`;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);
    
    const dataQuery = `
        SELECT t.*, a.account_number, a.customer_id
        FROM transactions t
        JOIN accounts a ON t.account_id = a.id
        ${whereClause}
        ORDER BY t.transaction_date DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const dataResult = await query(dataQuery, [...params, limit, offset]);
    
    res.json({
        data: dataResult.rows,
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit)
    });
}));

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction details
 *       404:
 *         description: Transaction not found
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const transactionQuery = `
        SELECT t.*, a.account_number, a.customer_id, c.name as customer_name
        FROM transactions t
        JOIN accounts a ON t.account_id = a.id
        JOIN customers c ON a.customer_id = c.id
        WHERE t.id = $1
    `;
    const transactionResult = await query(transactionQuery, [id]);
    
    if (transactionResult.rows.length === 0) {
        return res.status(404).json({
            error: 'Transaction not found',
            code: 'TRANSACTION_NOT_FOUND'
        });
    }
    
    res.json(transactionResult.rows[0]);
}));

module.exports = router;
