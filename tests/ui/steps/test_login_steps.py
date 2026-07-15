from pytest_bdd import (scenarios, given, when, then)

from tests.ui.pages.login_page import LoginPage
from tests.ui.utils.UI_config import *

scenarios("../features/login_page.feature")

@given("I am on the login page")
def open_login_page(browser_page, context):

    login_page = LoginPage(browser_page)

    login_page.open(BASE_UI_URL)

    context["login_page"] = login_page

@when("I enter valid credentials and click Login")
def valid_login(context):

    context["login_page"].login(VALID_USR, VALID_PWD)

@when("I enter wrong password and click Login")
def invalid_login(context):

    context["login_page"].login(VALID_USR, INVALID_PWD)

@when("I click Login without entering anything")
def empty_form(context):

    context["login_page"].click_login()


@then("I am redirected to the dashboard")
def verify_dashboard(context):

    page = context["login_page"].page

    page.wait_for_url("**/dashboard")

    assert "/dashboard" in page.url


@then("An error message is displayed on screen")
def verify_error(context):

    # error_message = (
    #     context["login_page"].get_error_message()
    # )

    page = context["login_page"].page

    page.wait_for_timeout(3000)

    body_text = page.locator("body").inner_text()

    assert (
        "Login failed" in body_text
        or
        "Invalid credentials" in body_text
        or
        "Authentication failed" in body_text
    )





    # print("\nCurrent URL:")
    # print(page.url)

    # print("\nCurrent Page Content:")
    # print(page.content())

    # #error_message = (
    #     context["login_page"]
    #     .get_error_message()
    # )
    



    # assert True

@then("Validation messages appear for both fields")
def validate_empty_form_errors(context):

    login_page = context["login_page"]

    username_error = (
        login_page.get_username_validation()
    )

    password_error = (
        login_page.get_password_validation()
    )

    assert username_error != ""

    assert password_error != ""

