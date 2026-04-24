# FinCore Bank - Backend API

Complete Node.js/Express REST API with Swagger documentation for the FinCore Bank system.

## 📁 Directory Structure

```
app/
├── package.json              # Dependencies and scripts
├── Dockerfile               # Multi-stage Docker build
├── .env.example            # Environment variables template
├── src/
│   ├── server.js           # Main Express server
│   ├── config/
│   │   └── database.js     # PostgreSQL connection pool
│   ├── middleware/
│   │   ├── auth.js         # JWT authentication
│   │   ├── errorHandler.js # Global error handling
│   │   └── validator.js    # Request validation
│   ├── routes/
│   │   ├── auth.js         # Authentication endpoints
│   │   ├── customers.js    # Customer CRUD
│   │   ├── accounts.js     # Account operations
│   │   ├── transactions.js # Transaction queries
│   │   ├── loans.js        # Loan management
│   │   └── dashboard.js    # Dashboard statistics
│   └── utils/
│       └── swagger.js      # Swagger configuration
└── client/                 # React UI (separate folder)
```

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Start development server
npm run dev

# API will be available at:
# http://localhost:4000/api/v1
# http://localhost:4000/api/docs (Swagger UI)
```

### Docker

```bash
# Build and run with Docker Compose (from project root)
docker compose up -d

# API will be available at:
# http://localhost:4000/api/v1
```

## 📚 API Documentation

### Swagger UI
Interactive API documentation: **http://localhost:4000/api/docs**

### Base URL
```
http://localhost:4000/api/v1
```

### Authentication

All endpoints (except `/auth/login` and `/health`) require JWT authentication.

**Login**:
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  },
  "expires_in": "24h"
}
```

**Use Token**:
```bash
curl http://localhost:4000/api/v1/customers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Accounts

| Username | Password | Role | Access |
|----------|----------|------|--------|
| admin | Admin@123 | admin | Full access |
| viewer | Viewer@123 | read_only | Read-only |
| testuser | Test@123 | standard | Standard user |

## 🔌 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `GET /auth/verify` - Verify JWT token

### Customers
- `GET /customers` - List customers (paginated, filterable)
- `GET /customers/:id` - Get customer details with accounts and transactions

**Query Parameters**:
- `status` - Filter by status (active, inactive, blocked)
- `search` - Search by name or email
- `page` - Page number (default: 1)
- `limit` - Records per page (default: 25)

### Accounts
- `GET /accounts` - List accounts (paginated, filterable)
- `GET /accounts/:id` - Get account details

**Query Parameters**:
- `customer_id` - Filter by customer
- `status` - Filter by status (active, dormant, closed)
- `account_type` - Filter by type (savings, current, fixed_deposit)
- `page`, `limit` - Pagination

### Transactions
- `GET /transactions` - List transactions (paginated, filterable)
- `GET /transactions/:id` - Get transaction details

**Query Parameters**:
- `account_id` - Filter by account
- `type` - Filter by type (credit, debit, transfer)
- `status` - Filter by status (completed, pending, failed, reversed)
- `from_date` - Start date (YYYY-MM-DD)
- `to_date` - End date (YYYY-MM-DD)
- `min_amount` - Minimum amount
- `max_amount` - Maximum amount
- `page`, `limit` - Pagination

### Loans
- `GET /loans` - List loans (paginated, filterable)
- `GET /loans/:id` - Get loan details with computed fields

**Query Parameters**:
- `customer_id` - Filter by customer
- `status` - Filter by status (active, closed, defaulted, restructured)
- `loan_type` - Filter by type (home, personal, auto, education)
- `page`, `limit` - Pagination

### Dashboard
- `GET /dashboard/summary` - Get summary statistics
- `GET /dashboard/transactions-by-day` - Transaction counts (last 30 days)
- `GET /dashboard/loan-status-distribution` - Loan status distribution

### Health Check
- `GET /health` - System health check (no auth required)

## 📊 Response Format

### Success Response (List)
```json
{
  "data": [...],
  "total": 10000,
  "page": 1,
  "limit": 25,
  "total_pages": 400
}
```

### Success Response (Single)
```json
{
  "id": 1,
  "name": "JOHN DOE",
  "email": "john.doe@email.com",
  ...
}
```

### Error Response
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## 🔐 Security Features

- **JWT Authentication** - Token-based auth with expiration
- **Helmet** - Security headers
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **CORS** - Configurable origin
- **Input Validation** - Request validation middleware
- **SQL Injection Protection** - Parameterized queries
- **Error Handling** - Global error handler with sanitized responses

## 🛠️ Middleware

### Authentication (`auth.js`)
- `authenticateToken` - Verify JWT token
- `optionalAuth` - Optional authentication
- `requireRole` - Check user role

### Error Handler (`errorHandler.js`)
- `errorHandler` - Global error handler
- `asyncHandler` - Async route wrapper
- `AppError` - Custom error class

### Validator (`validator.js`)
- `validatePagination` - Validate page and limit
- `validateDateRange` - Validate date range
- `validateAmountRange` - Validate amount range
- `validateRequired` - Validate required fields
- `validateEmail` - Validate email format

## 📝 Environment Variables

Create `.env` from `.env.example`:

```env
# Database
DATABASE_URL=postgresql://admin:fincore123@localhost:5432/fincore
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fincore
DB_USER=admin
DB_PASSWORD=fincore123

# JWT
JWT_SECRET=fincore_jwt_secret_2024
JWT_EXPIRES_IN=24h

# Server
NODE_ENV=development
API_PORT=4000
UI_PORT=3000

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## 🐛 Troubleshooting

### Cannot connect to database

**Error**: `ECONNREFUSED`

**Solution**:
1. Check PostgreSQL is running
2. Verify `.env` credentials
3. Test connection: `psql -h localhost -U admin -d fincore`

### Port already in use

**Error**: `EADDRINUSE`

**Solution**:
```bash
# Find process
lsof -i :4000

# Kill process
kill -9 <PID>
```

### JWT errors

**Error**: `Invalid token` or `Token expired`

**Solution**:
1. Login again to get a new token
2. Check `JWT_SECRET` matches between requests
3. Verify token format: `Bearer <token>`

## 📚 Additional Resources

- [Express Documentation](https://expressjs.com/)
- [PostgreSQL Node.js](https://node-postgres.com/)
- [JWT](https://jwt.io/)
- [Swagger](https://swagger.io/)

---

**Built with**: Node.js 20, Express 4, PostgreSQL 15, JWT, Swagger
