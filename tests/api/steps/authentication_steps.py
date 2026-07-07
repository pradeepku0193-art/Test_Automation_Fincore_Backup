from pytest_bdd import scenarios, given, when, then
from api.utils.config import (
    TEST_USER,
    TEST_PASSWORD
)

# Load scenarios from feature file
scenarios("../features/authentication.feature")


@given("a registered user exists")
def registered_user():
    """
    Pre-condition step.

    Since testuser already exists in FinCore,
    nothing needs to be created here.
    """
    pass


@when("I login with valid credentials")
def login_with_valid_credentials(api_client, context):

    payload = {
        "username": TEST_USER,
        "password": TEST_PASSWORD
    }

    response = api_client.post(
        "/auth/login",
        payload
    )

    context["response"] = response


@when("I login with invalid password")
def login_with_invalid_password(api_client, context):

    payload = {
        "username": TEST_USER,
        "password": "WrongPassword123"
    }

    response = api_client.post(
        "/auth/login",
        payload
    )

    context["response"] = response


@when("I login with empty credentials")
def login_with_empty_credentials(api_client, context):

    payload = {}

    response = api_client.post(
        "/auth/login",
        payload
    )

    context["response"] = response


@then("response status should be 200")
def validate_success_status(context):

    assert context["response"].status_code == 200


@then("response status should be 401")
def validate_unauthorized_status(context):

    assert context["response"].status_code == 401


@then("response status should be 400")
def validate_bad_request_status(context):

    assert context["response"].status_code == 400


@then("JWT token should be present")
def validate_jwt_token(context):

    response_json = context["response"].json()

    # Most likely response:
    # {
    #   "token":"eyJ..."
    # }

    assert "token" in response_json
    assert response_json["token"] is not None
    assert len(response_json["token"]) > 0