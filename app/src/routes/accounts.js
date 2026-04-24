/**
 * Accounts Routes
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
 * /accounts:
 *   get:
 *     summary: Get all accounts
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: customer_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, dormant, closed]
 *       - in: query
 *         name: account_type
 *         schema:
 *           type: string
 *           enum: [savings, current, fixed_deposit]
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
 *         description: Paginated account list
 */
router.get('/', validatePagination, asyncHandler(async (req, res) => {
    const { page, limit, offset } = req.pagination;
    const { customer_id, status, account_type } = req.query;
    
    const conditions = [];
    const params = [];
    let paramIndex = 1;
    
    if (customer_id) {
        conditions.push(`customer_id = $${paramIndex++}`);
        params.push(customer_id);
    }
    
    if (status) {
        conditions.push(`status = $${paramIndex++}`);
        params.push(status);
    }
    
    if (account_type) {
        conditions.push(`account_type = $${paramIndex++}`);
        params.push(account_type);
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    const countQuery = `SELECT COUNT(*) FROM accounts ${whereClause}`;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);
    
    const dataQuery = `
        SELECT a.*, c.name as customer_name, c.email as customer_email
        FROM accounts a
        JOIN customers c ON a.customer_id = c.id
        ${whereClause}
        ORDER BY a.opened_date DESC
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
 * /accounts/{id}:
 *   get:
 *     summary: Get account by ID
 *     tags: [Accounts]
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
 *         description: Account details
 *       404:
 *         description: Account not found
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const accountQuery = `
        SELECT a.*, c.name as customer_name, c.email as customer_email
        FROM accounts a
        JOIN customers c ON a.customer_id = c.id
        WHERE a.id = $1
    `;
    const accountResult = await query(accountQuery, [id]);
    
    if (accountResult.rows.length === 0) {
        return res.status(404).json({
            error: 'Account not found',
            code: 'ACCOUNT_NOT_FOUND'
        });
    }
    
    res.json(accountResult.rows[0]);
}));

module.exports = router;
