from datetime import datetime
from multiprocessing import context

from pytest_bdd import (scenarios,given,when,then)

from tests.ui.pages.transactions_page import TransactionPage
from tests.ui.pages.login_page import LoginPage
from tests.ui.utils.UI_config import (BASE_UI_URL, VALID_USR, VALID_PWD)

scenarios("../features/transactions.feature")

@given("I am logged into the portal")
def logged_in_user(browser_page,context):

    login_page = LoginPage(browser_page)

    login_page.open(BASE_UI_URL)

    login_page.login(VALID_USR,VALID_PWD)

    browser_page.wait_for_url("**/dashboard")

    context["page"] = browser_page



@given("I am on the transactions screen")
def open_transactions(context):

    transaction_page = (TransactionPage(context["page"]))

    transaction_page.navigate()

    context["transaction_page"] = (transaction_page)


@given("Filters are applied on transactions screen")
def filters_are_applied_on_transactions_screen(context):

    transaction_page = TransactionPage(context["page"])
    transaction_page.navigate()
    context["transaction_page"] = transaction_page
    transaction_page.apply_sample_filters()
    context["filtered_count"] = (transaction_page.get_row_count()) 


@when("I select type = Credit")
def filter_credit(context):

    (context["transaction_page"].select_transaction_type("Credit"))


@then("All visible rows show transaction_type = Credit")
def validate_credit(context):

    txn_types = context["transaction_page"].get_transaction_types()

    print(f"txn_types: {txn_types}")

    for txn_type in txn_types:

        assert (txn_type.lower() == "credit")


@when("I set a from_date and to_date and apply")
def date_filter(context):

    context["transaction_page"].apply_date_filter("2026-06-13","2026-06-13")


@then("All visible transaction dates fall within the range")
def validate_dates(context):

    dates = (context["transaction_page"].get_transaction_dates())

    from_date = datetime(2026,6,13)

    to_date = datetime(2026,6,13)

    for date_text in dates:

        txn_date = (datetime.fromisoformat(date_text.replace("Z","+00:00")).replace(tzinfo=None))

        print(f"txn_date: {txn_date}, from_date: {from_date}, to_date: {to_date}")

        assert (from_date<= txn_date<= to_date)


#@when("I set min and max amount and apply")
#def amount_filter(context):

    # Implement after
    # amount textbox locators
    #pass


#@then("All visible amounts are within the specified range")
#def validate_amount_range(context):

    #amounts = (context["transaction_page"].get_amounts())

    #for amount in amounts:

        #amount = (float(amount.replace( "$","").replace( ",","")))

        #assert (100 <= amount <= 500)


@when("I click the Clear button")
def clear_filters(context):

    (context["transaction_page"].clear_filters())


@then("All transactions are shown again and filters are reset")
def filters_reset(context):

    assert (context["transaction_page"].filters_cleared())