from pytest_bdd import scenarios, given, when, then, parsers
from tests.api.utils.config import (
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

@given("No credentials are provided")
def no_credentials(context):
    context["credentials"] = {}


@when(parsers.parse('I POST valid credentials to "/auth/login"'))
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



@when(parsers.parse('I POST wrong password to "/auth/login"'))
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


@when(parsers.parse('I POST empty body to "/auth/login"'))
def login_with_empty_credentials(api_client, context):

    payload = {}

    response = api_client.post(
        "/auth/login",
        payload
    )

    context["response"] = response


@then("the response status should be 200")
def validate_success_status(context):

    assert context["response"].status_code == 200


@then("response status should be 401")
def validate_unauthorized_status(context):

    assert context["response"].status_code == 401


@then("response status should be 400")
def validate_bad_request_status(context):

    assert context["response"].status_code == 400


@then("the response should contain a JWT token")
def validate_jwt_token(context):

    response_json = context["response"].json()

    assert "token" in response_json

    token = response_json["token"]

    assert token
   
    assert len(token.split(".")) == 3

    assert "user" in response_json

@then("the response should contain an error message")
def validate_error_message(context):

    response_json = context["response"].json()

    assert "error" in response_json

    error_message = response_json["error"]

    assert error_message

@then("the response should contain a validation error")
def validate_validation_error(context):
    
    response_json = context["response"].json()

    assert "error" in response_json

    assert response_json["error"] is not None
