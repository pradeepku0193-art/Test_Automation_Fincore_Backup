/**
 * Swagger/OpenAPI Configuration
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FinCore Bank API',
            version: '1.0.0',
            description: 'FinCore Bank REST API for test automation training',
            contact: {
                name: 'FinCore Bank',
                email: 'support@fincorebank.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:4000/api/v1',
                description: 'Development server'
            },
            {
                url: 'http://localhost:4000/api/v1',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token obtained from /auth/login'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Error message'
                        },
                        code: {
                            type: 'string',
                            description: 'Error code'
                        }
                    }
                },
                PaginationResponse: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: {}
                        },
                        total: {
                            type: 'integer',
                            description: 'Total records'
                        },
                        page: {
                            type: 'integer',
                            description: 'Current page'
                        },
                        limit: {
                            type: 'integer',
                            description: 'Records per page'
                        },
                        total_pages: {
                            type: 'integer',
                            description: 'Total pages'
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Authentication',
                description: 'User authentication endpoints'
            },
            {
                name: 'Customers',
                description: 'Customer management'
            },
            {
                name: 'Accounts',
                description: 'Account operations'
            },
            {
                name: 'Transactions',
                description: 'Transaction queries'
            },
            {
                name: 'Loans',
                description: 'Loan management'
            },
            {
                name: 'Dashboard',
                description: 'Dashboard statistics'
            }
        ]
    },
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * Setup Swagger UI
 */
const setupSwagger = (app) => {
    // Swagger UI
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'FinCore Bank API Documentation'
    }));
    
    // Swagger JSON
    app.get('/api/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    
    console.log('✓ Swagger documentation available at /api/docs');
};

module.exports = {
    setupSwagger,
    swaggerSpec
};
