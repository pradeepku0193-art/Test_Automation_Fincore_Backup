const { isOriginAllowed, getAllowedOrigins } = require('../src/utils/cors');

describe('CORS origin handling', () => {
  it('allows https local development origins', () => {
    const allowedOrigins = getAllowedOrigins('https://localhost:3000,http://127.0.0.1:5173');

    expect(isOriginAllowed('https://localhost:3000', allowedOrigins)).toBe(true);
    expect(isOriginAllowed('http://127.0.0.1:5173', allowedOrigins)).toBe(true);
  });

  it('allows localhost and loopback origins even when not explicitly listed', () => {
    const allowedOrigins = getAllowedOrigins('');

    expect(isOriginAllowed('https://localhost:3000', allowedOrigins)).toBe(true);
    expect(isOriginAllowed('http://127.0.0.1:3000', allowedOrigins)).toBe(true);
    expect(isOriginAllowed('http://localhost:4000', allowedOrigins)).toBe(true);
  });
});
