import pytest

from api.utils.api_client import APIClient
from api.utils.db_client import DBClient
from api.utils.config import *


@pytest.fixture(scope="session")
def api_client():
    return APIClient(BASE_URL)


@pytest.fixture(scope="session")
def db_client():
    return DBClient(DB_CONFIG)

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

    assert response.status_code == 200

    token = response.json().get("token")

    assert token is not None

    return token


@pytest.fixture
def context():
    return{}
