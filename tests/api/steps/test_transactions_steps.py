from pytest_bdd import scenarios,given, when, then, parsers
from datetime import datetime

from tests.api.utils.db_queries import(TRANSACTION_COUNT, TRANSACTION_BY_ID)

scenarios("../features/transactions.feature")

# Background step

@given("I am authenticated")
def user_is_authenticated(auth_token):
    return auth_token

#When steps

@when(parsers.parse('I GET "{endpoint}"'))
def get_all_transactions(api_client, auth_headers, context,endpoint):

    response = api_client.get(
        endpoint,
        headers = auth_headers
    )

    context["response"] = response
    context["endpoint"] = endpoint

# status check

@then("the response status code should be 200")
def validate_status_200(context):

    print(f"Response status code: {context['response'].status_code}")
    print(f"Response content: {context['response'].text}")

    assert context["response"].status_code == 200




# Transaction validation 

@then(parsers.parse('the returned transactions should match the DB count'))
def validate_transactions_count(context,db_client):

    api_data = context["response"].json()

    query_result = db_client.execute_query(TRANSACTION_COUNT)
    print("Query Result:", query_result)

    db_count = db_client.execute_query(
        TRANSACTION_COUNT
    )[0]["transaction_count"]

    print("API RESPONSE:", api_data)
    print("DB COUNT:", db_count)

    assert api_data["total"] == db_count


# filter checks

@then(parsers.parse('the all returned records should have "{field}" equal to "{value}"'))
def validate_field_value(context,field,value):

    data = context["response"].json().get("data", [])
    print(f"data received: {data}")

    for record in data:
        print(f"Validating record: {record}")

        #assert field in record

        assert (record[field]).lower() == value.lower()


@then("the all returned transaction_dates fall within the range")
def validate_transaction_date_range(context):

    transactions = context["response"].json()

    from_date = datetime.strptime(
        "2024-06-10",
        "%Y-%m-%d"
    )

    to_date = datetime.strptime(
        "2025-06-11",
        "%Y-%m-%d"
    )

    for txn in transactions:

        txn_date = datetime.strptime(
            txn["transaction_date"],
            "%Y-%m-%d"
        )

        assert from_date <= txn_date <= to_date

# Amount range validation

@then("the All returned amounts are between 100 and 500")
def validate_amount_range(context):

    transactions = context["response"].json()

    for txn in transactions:
        print(f"txn: {txn}")

        amount = float(txn["amount"])

        print(f"Validating amount: {amount}")

        assert 100 <= amount <= 500

# Account ID validation

@then("the All returned records belong to account_id 5")
def validate_account_id(context):

    transactions = context["response"].json().get("data", [])

    print(f"Validating account_id for transactions: {transactions}")

    for txn in transactions:

        assert txn["account_id"] == 5

# Account DB count validation

@then("the returned records should match the DB count")
def validate_account_transaction_count(context,db_client):

    api_data = context["response"].json()

    db_result = db_client.execute_query(
        TRANSACTION_BY_ID
    )

    print("DB_result:", db_result)
    
    db_count = db_result[0]["cnt"]

    assert len(api_data) == db_count