from pytest_bdd import (
    scenarios,
    given,
    when,
    then
)

from tests.ui.pages.customer_page import CustomerPage
from tests.ui.pages.login_page import LoginPage
from tests.ui.utils.UI_config import (BASE_UI_URL, VALID_USR, VALID_PWD)



scenarios("../features/customers.feature")

@given("I am logged into the portal")
def logged_in_user(
        browser_page,
        context):

    login_page = LoginPage(browser_page)

    login_page.open(BASE_UI_URL)

    login_page.login(
        VALID_USR,
        VALID_PWD
    )

    browser_page.wait_for_url(
        "**/dashboard"
    )

    context["page"] = browser_page

@given("I am on the customers screen")
def open_customers_page(context):

    customer_page = CustomerPage(
        context["page"]
    )

    customer_page.navigate()

    context["customer_page"] = customer_page


@when("The page loads")
def page_load(context):

    assert (
        context["customer_page"]
        .is_page_loaded()
    )


@then("A table with customer records is visible")
def table_visible(context):

    assert (
        context["customer_page"]
        .customer_table_visible()
    )


@when("I type a name in the search box")
def search_customer(context):

    context["customer_page"].search_customer(
        "LISA"
    )


@then("Only matching customers are shown in the table")
def validate_search_results(context):

    names = (
        context["customer_page"]
        .get_customer_names()
    )

    for name in names:

        assert (
            "LISA"
            in name.upper()
        )


@when("I select a status from the filter dropdown")
def select_status(context):

    context["customer_page"].filter_status(
        "active"
    )


@then("All visible rows show that status value")
def validate_status(context):

    statuses = (
        context["customer_page"]
        .get_visible_statuses()
    )

    for status in statuses:

        assert (
            status.lower()
            == "active"
        )


@when("I click on a customer row")
def click_customer(context):

    context["customer_page"].open_first_customer()


@then("I navigate to that customer's detail page with all fields visible")
def validate_customer_detail(context):

    assert (
        context["customer_page"]
        .customer_detail_visible()
    )