/**
 * Loans Routes
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
 * /loans:
 *   get:
 *     summary: Get all loans
 *     tags: [Loans]
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
 *           enum: [active, closed, defaulted, restructured]
 *       - in: query
 *         name: loan_type
 *         schema:
 *           type: string
 *           enum: [home, personal, auto, education]
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
 *         description: Paginated loan list
 */
router.get('/', validatePagination, asyncHandler(async (req, res) => {
    const { page, limit, offset } = req.pagination;
    const { customer_id, status, loan_type } = req.query;
    
    const conditions = [];
    const params = [];
    let paramIndex = 1;
    
    if (customer_id) {
        conditions.push(`l.customer_id = $${paramIndex++}`);
        params.push(customer_id);
    }
    
    if (status) {
        conditions.push(`l.status = $${paramIndex++}`);
        params.push(status);
    }
    
    if (loan_type) {
        conditions.push(`l.loan_type = $${paramIndex++}`);
        params.push(loan_type);
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    const countQuery = `SELECT COUNT(*) FROM loans l ${whereClause}`;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);
    
    const dataQuery = `
        SELECT l.*, c.name as customer_name, c.email as customer_email
        FROM loans l
        JOIN customers c ON l.customer_id = c.id
        ${whereClause}
        ORDER BY l.start_date DESC
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
 * /loans/{id}:
 *   get:
 *     summary: Get loan by ID with computed fields
 *     tags: [Loans]
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
 *         description: Loan details
 *       404:
 *         description: Loan not found
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const loanQuery = `
        SELECT l.*, c.name as customer_name, c.email as customer_email,
               ROUND(((l.principal_amount - l.outstanding_amount) / l.principal_amount * 100)::numeric, 2) as repayment_percentage
        FROM loans l
        JOIN customers c ON l.customer_id = c.id
        WHERE l.id = $1
    `;
    const loanResult = await query(loanQuery, [id]);
    
    if (loanResult.rows.length === 0) {
        return res.status(404).json({
            error: 'Loan not found',
            code: 'LOAN_NOT_FOUND'
        });
    }
    
    res.json(loanResult.rows[0]);
}));

module.exports = router;
