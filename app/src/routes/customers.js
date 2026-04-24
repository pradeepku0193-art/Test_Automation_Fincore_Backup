/**
 * Customers Routes
 */

const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { validatePagination } = require('../middleware/validator');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers with optional filters
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, blocked]
 *         description: Filter by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 25
 *     responses:
 *       200:
 *         description: Paginated customer list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginationResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/', validatePagination, asyncHandler(async (req, res) => {
    const { page, limit, offset } = req.pagination;
    const { status, search } = req.query;
    
    // Build WHERE clause
    const conditions = [];
    const params = [];
    let paramIndex = 1;
    
    if (status) {
        conditions.push(`status = $${paramIndex++}`);
        params.push(status);
    }
    
    if (search) {
        conditions.push(`(name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`);
        params.push(`%${search}%`);
        paramIndex++;
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Get total count
    const countQuery = `SELECT COUNT(*) FROM customers ${whereClause}`;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);
    
    // Get paginated data
    const dataQuery = `
        SELECT id, name, email, phone, address, date_of_birth, status, created_date, kyc_verified
        FROM customers
        ${whereClause}
        ORDER BY created_date DESC
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
 * /customers/{id}:
 *   get:
 *     summary: Get customer by ID with accounts and recent transactions
 *     tags: [Customers]
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
 *         description: Customer details
 *       404:
 *         description: Customer not found
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Get customer
    const customerQuery = `
        SELECT id, name, email, phone, address, date_of_birth, status, created_date, kyc_verified
        FROM customers
        WHERE id = $1
    `;
    const customerResult = await query(customerQuery, [id]);
    
    if (customerResult.rows.length === 0) {
        return res.status(404).json({
            error: 'Customer not found',
            code: 'CUSTOMER_NOT_FOUND'
        });
    }
    
    // Get accounts
    const accountsQuery = `
        SELECT id, account_number, account_type, balance, currency, status, opened_date
        FROM accounts
        WHERE customer_id = $1
        ORDER BY opened_date DESC
    `;
    const accountsResult = await query(accountsQuery, [id]);
    
    // Get recent transactions (last 50)
    const transactionsQuery = `
        SELECT t.id, t.account_id, a.account_number, t.transaction_type, t.amount, 
               t.currency, t.transaction_date, t.status, t.description
        FROM transactions t
        JOIN accounts a ON t.account_id = a.id
        WHERE a.customer_id = $1
        ORDER BY t.transaction_date DESC
        LIMIT 50
    `;
    const transactionsResult = await query(transactionsQuery, [id]);
    
    res.json({
        customer: customerResult.rows[0],
        accounts: accountsResult.rows,
        recent_transactions: transactionsResult.rows
    });
}));

module.exports = router;
