const DEFAULT_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:5173',
    'https://localhost:5173',
    'http://127.0.0.1:3000',
    'https://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'https://127.0.0.1:5173',
    'http://localhost:30000',
    'https://localhost:30000'
];

function getAllowedOrigins(envValue = '') {
    const configuredOrigins = (envValue || '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);

    return [...new Set([...DEFAULT_ALLOWED_ORIGINS, ...configuredOrigins])];
}

function isOriginAllowed(origin, allowedOrigins = []) {
    if (!origin) {
        return true;
    }

    const normalizedOrigin = origin.trim();
    if (!normalizedOrigin) {
        return true;
    }

    if (allowedOrigins.includes('*') || allowedOrigins.includes(normalizedOrigin)) {
        return true;
    }

    try {
        const { hostname } = new URL(normalizedOrigin);
        return ['localhost', '127.0.0.1', '::1'].includes(hostname);
    } catch (error) {
        return false;
    }
}

module.exports = {
    DEFAULT_ALLOWED_ORIGINS,
    getAllowedOrigins,
    isOriginAllowed
};
