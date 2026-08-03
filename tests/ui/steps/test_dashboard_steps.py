from pytest_bdd import (
    scenarios,
    given,
    when,
    then
)

from tests.ui.pages.login_page import LoginPage
from tests.ui.pages.dashboard_page import DashboardPage

from tests.ui.utils.UI_config  import (BASE_UI_URL,VALID_USR,VALID_PWD)

from tests.ui.utils.db_queries import (TOTAL_CUSTOMERS, ACTIVE_ACCOUNTS, ACTIVE_LOANS)

scenarios("../features/dashboard.feature")


# =====================================================
# BACKGROUND
# =====================================================

@given("I am on the dashboard")
def open_dashboard(
    browser_page,
    context
):
    """
    Login and navigate to dashboard.
    """

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

    context["dashboard"] = DashboardPage(
        browser_page
    )


# =====================================================
# TOTAL CUSTOMERS
# =====================================================

@when("I read the Total Customers card value")
def read_total_customers(context):

    dashboard = context["dashboard"]

    context["ui_value"] = (dashboard.get_total_customers())

    print(
        f"UI Total Customers = "f"{context['ui_value']}")


@then("Value matches SELECT COUNT(*) FROM customers")
def validate_total_customers(context,db_client):

    db_count = db_client.execute_query(TOTAL_CUSTOMERS)[0]["total_customers"]

    print(
        f"DB Total Customers = "f"{db_count}")

    assert context["ui_value"] == db_count


# =====================================================
# ACTIVE ACCOUNTS
# =====================================================

@when("I read the Active Accounts card value")
def read_active_accounts(context):

    dashboard = context["dashboard"]

    context["ui_value"] = (dashboard.get_active_accounts())

    print(
        f"UI Active Accounts = "f"{context['ui_value']}")


@then("Value matches DB count of accounts with status active")
def validate_active_accounts(context,db_client):

    db_count = db_client.execute_query(ACTIVE_ACCOUNTS)[0]["active_accounts"]

    print(
        f"DB Active Accounts = "f"{db_count}"
    )

    assert context["ui_value"] == db_count


# =====================================================
# ACTIVE LOANS
# =====================================================

@when("I read the Active Loans card value")
def read_active_loans(context):

    dashboard = context["dashboard"]

    context["ui_value"] = (dashboard.get_active_loans())

    print(
        f"UI Active Loans = "f"{context['ui_value']}")


@then("Value matches DB count of loans with status active")
def validate_active_loans(context,db_client):

    db_count = db_client.execute_query(ACTIVE_LOANS)[0]["active_loans"]

    print(
        f"DB Active Loans = "f"{db_count}")

    assert context["ui_value"] == db_count