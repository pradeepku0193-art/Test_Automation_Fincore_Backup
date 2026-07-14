import pytest


from tests.api.utils.api_client import APIClient
from tests.api.utils.db_client import DBClient
from tests.api.utils.config import *

print("✅ Loading tests/conftest.py")


@pytest.fixture(scope="session")
def api_client():
    return APIClient(BASE_URL)


@pytest.fixture(scope="session")
def db_client():
    return DBClient(DB_CONFIG)


#AUTHENTICATION FIXTURES

@pytest.fixture(scope="session")
def auth_token(api_client):

    payload = {
        "username" : TEST_USER,
        "password" : TEST_PASSWORD
    }

    response = api_client.post(
        "/auth/login",
        payload
    )

    assert response.status_code == 200, (
        f"Login failed. "
        f"Status={response.status_code}, "
        f"Response={response.text}"
    )

    response_json = response.json()

    assert "token" in response_json
    assert response_json["token"]

    assert "user" in response_json

    return response_json["token"]

#AUTHENTICATED CLIENT FIXTURE

@pytest.fixture(scope="session")
def authed_client(api_client, auth_token):
    api_client.token = auth_token
    return api_client


@pytest.fixture
def context():
    return {}

@pytest.fixture(scope="session")
def auth_headers(auth_token):

    return {
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json"
    }

@pytest.fixture(scope="session", autouse=True)
def validate_database(db_client):
    conn = db_client.get_connection()

    assert conn is not None

    conn.close()


    

def pytest_html_report_title(report):
    report.title = "Fincore Banking API Test Report"




