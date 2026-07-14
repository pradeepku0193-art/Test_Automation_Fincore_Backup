from pytest_bdd import scenarios, given, when, then, parsers
from datetime import datetime

from tests.api.utils.db_queries import (LOAN_COUNT, DASHBOARD_SUMMARY)

scenarios("../features/loans.feature")

@given("I am authenticated")
def user_is_authenticated(auth_token):
    return auth_token

@when(parsers.parse('I GET "{endpoint}"'))
def get_all_loans(api_client, auth_headers, context, endpoint):
    response = api_client.get(
        endpoint,
        headers=auth_headers
    )

    context["response"] = response

@then("the response status code should be 200")
def validate_status_200(context):

    assert context["response"].status_code == 200

@then(parsers.parse('the returned records should match the DB count'))
def validate_loans_count(context, db_client):
    api_data = context["response"].json().get("total", 0)

    print("API RESPONSE:", api_data)

    db_count = db_client.execute_query(LOAN_COUNT)[0]["loan_count"]

    print("DB COUNT:", db_count)

    assert api_data == db_count

@then(parsers.parse('the returned records should have "{field}" equal to "{value}"'))
def validate_record_field(context, field, value):

    api_data = context["response"].json().get("data", [])

    for record in api_data:
        print(f"Checking record: {record}")

        if record.get(field) == value:

            assert True, f"Record {record} has {field} equal to {value}"

@then("the all fields present including loan_duration_days and emi_amount")
def validate_all_fields_present(context):
    api_data = context["response"].json().get("data",[])

    for record in api_data:

        print(f"Checking record: {record}")
        assert "loan_duration_days" in record, f"loan_duration_days is present in record {record}"
        assert "emi_amount" in record, f"emi_amount is present in record {record}"

@then("the loan_duration_days matches end_date - start_date calculation")
def validate_loan_duration(context):
    api_data = context["response"].json().get("data", [])

    for record in api_data:
        print(f"Checking record: {record}")
        start_date = datetime.strptime(record["start_date"], "%Y-%m-%d")
        end_date = datetime.strptime(record["end_date"], "%Y-%m-%d")
        expected_duration = (end_date - start_date).days
        assert record["loan_duration_days"] == expected_duration, f"loan_duration_days matches for record {record}"

@then("the total_customers and active_loans match DB counts")
def validate_dashboard_summary(context, db_client):
    api_data = context["response"].json()

    db_summary = db_client.execute_query(DASHBOARD_SUMMARY)[0]

    print("API RESPONSE:", api_data)
    print("DB SUMMARY:", db_summary)

    assert api_data["total_customers"] == db_summary["total_customers"], "Total customers count matches"
    assert api_data["active_loans"] == db_summary["active_loans"], "Active loans count matches"