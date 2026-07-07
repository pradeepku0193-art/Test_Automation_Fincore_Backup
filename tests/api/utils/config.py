import os

BASE_URL = "http://localhost:4000/api/v1"

TEST_USER = "testuser"
TEST_PASSWORD = "Test@123"

DB_CONFIG = {
    "host" : os.getenv("localhost"),
    "port" : os.getenv("5432"),
    "data_base" : os.getenv("fincore"),
    "user" : os.getenv("admin"),
    "password" : os.getenv("fincore123")
}