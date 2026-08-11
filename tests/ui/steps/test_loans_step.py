from pytest_bdd import (scenarios, given, when, then)

from tests.ui.pages.loan_page import LoanPage
from tests.ui.pages.login_page import LoginPage
from tests.ui.utils.UI_config import (BASE_UI_URL, VALID_USR, VALID_PWD)

scenarios('../features/loans.feature')

@given("I am logged into the portal")
def logged_in_user(browser_page,context):

    login_page = LoginPage(browser_page)

    login_page.open(BASE_UI_URL)

    login_page.login(VALID_USR,VALID_PWD)

    browser_page.wait_for_url("**/dashboard")

    context["page"] = browser_page

@given("I am on the loans screen")
def open_loans_page(context):

    loans_page = LoanPage(context["page"])

    loans_page.navigate()

    context["loans_page"] = loans_page

@when("The page loads")
def loans_page_loads(context):

    assert (context["loans_page"].is_page_loaded())


@then("A table with loan records is visible")
def loans_table_visible(context):

    assert (context["loans_page"].loan_table_visible())


@when("I select status = Active")
def select_active_status(context):

    context["loans_page"].select_status("Active")

@then("Only Active loans are shown")
def validate_active_loans(context):

    statuses = context["loans_page"].get_loan_statuses()

    print("Loan Statuses: ", statuses)

    for status in statuses:

        assert (status.lower() == "Active")

@when("I select type = Personal")
def select_personal_type(context):
    
    context["loans_page"].select_type("Personal")

@then("Only Personal loans are shown")
def validate_personal_loans(context):

    types = context["loans_page"].get_loan_types()

    print("Loan Types: ", types)

    for type in types:

        assert (type.lower() == "Personal")

@when("I click loan row")
def click_loan_row(context):

    context["loans_page"].open_loan_row()

    page = context["loans_page"].page

    print(f"current URL : {page.url}", flush=True)

@then("Loan detail page shows all fields including computed loan_duration_days and emi_amount")
def validate_loan_detail_page(context):

    assert (context["loans_page"].loan_detail_visible())

    