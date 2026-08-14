import os

BASE_URL = "http://localhost:4000/api/v1"

TEST_USER = "testuser"
TEST_PASSWORD = "Test@123"

# Database configuration for tests. Read from environment with sensible defaults.
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", "5432")),
    "database": os.getenv("DB_NAME", "fincore"),
    "user": os.getenv("DB_USER", "admin"),
    "password": os.getenv("DB_PASSWORD", "fincore123")
}