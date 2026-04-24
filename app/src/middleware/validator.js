/**
 * Request Validation Middleware
 */

/**
 * Validate pagination parameters
 */
const validatePagination = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    
    if (page < 1) {
        return res.status(400).json({
            error: 'Page must be greater than 0',
            code: 'VALIDATION_ERROR'
        });
    }
    
    if (limit < 1 || limit > 100) {
        return res.status(400).json({
            error: 'Limit must be between 1 and 100',
            code: 'VALIDATION_ERROR'
        });
    }
    
    req.pagination = {
        page,
        limit,
        offset: (page - 1) * limit
    };
    
    next();
};

/**
 * Validate date range
 */
const validateDateRange = (req, res, next) => {
    const { from_date, to_date } = req.query;
    
    if (from_date && isNaN(Date.parse(from_date))) {
        return res.status(400).json({
            error: 'Invalid from_date format',
            code: 'VALIDATION_ERROR'
        });
    }
    
    if (to_date && isNaN(Date.parse(to_date))) {
        return res.status(400).json({
            error: 'Invalid to_date format',
            code: 'VALIDATION_ERROR'
        });
    }
    
    if (from_date && to_date && new Date(from_date) > new Date(to_date)) {
        return res.status(400).json({
            error: 'from_date must be before to_date',
            code: 'VALIDATION_ERROR'
        });
    }
    
    next();
};

/**
 * Validate amount range
 */
const validateAmountRange = (req, res, next) => {
    const { min_amount, max_amount } = req.query;
    
    if (min_amount && (isNaN(min_amount) || parseFloat(min_amount) < 0)) {
        return res.status(400).json({
            error: 'Invalid min_amount',
            code: 'VALIDATION_ERROR'
        });
    }
    
    if (max_amount && (isNaN(max_amount) || parseFloat(max_amount) < 0)) {
        return res.status(400).json({
            error: 'Invalid max_amount',
            code: 'VALIDATION_ERROR'
        });
    }
    
    if (min_amount && max_amount && parseFloat(min_amount) > parseFloat(max_amount)) {
        return res.status(400).json({
            error: 'min_amount must be less than max_amount',
            code: 'VALIDATION_ERROR'
        });
    }
    
    next();
};

/**
 * Validate required fields
 */
const validateRequired = (fields) => {
    return (req, res, next) => {
        const missing = [];
        
        for (const field of fields) {
            if (!req.body[field]) {
                missing.push(field);
            }
        }
        
        if (missing.length > 0) {
            return res.status(400).json({
                error: `Missing required fields: ${missing.join(', ')}`,
                code: 'VALIDATION_ERROR',
                missing_fields: missing
            });
        }
        
        next();
    };
};

/**
 * Validate email format
 */
const validateEmail = (req, res, next) => {
    const { email } = req.body;
    
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid email format',
                code: 'VALIDATION_ERROR'
            });
        }
    }
    
    next();
};

module.exports = {
    validatePagination,
    validateDateRange,
    validateAmountRange,
    validateRequired,
    validateEmail
};
