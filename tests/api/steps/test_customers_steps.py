from pytest_bdd import scenarios,given, when, then, parsers

from tests.api.utils.db_queries import(
    CUSTOMER_COUNT,
    ACTIVE_CUSTOMER_COUNT,
    CUSTOMER_BY_ID
)

scenarios("../features/customers.feature")

# Background step

@given("I am authenticated")
def user_is_authenticated(auth_token):
    """
    Authentication already handled via fixture.
    """
    return auth_token

#When steps

@when(parsers.parse('I GET "{endpoint}"'))
def get_all_customers(api_client, auth_headers, context,endpoint):

    response = api_client.get(
        endpoint,
        headers = auth_headers
    )

    context["response"] = response


@when(parsers.parse('I GET "{endpoint}" without an auth token'))
def get_without_token(api_client,context,endpoint):

    response = api_client.get(endpoint)

    context["response"] = response

# status check

@then("the response status should be 200")
def validate_status_200(context):

    print(f"Response status code: {context['response'].status_code}")
    print(f"Response content: {context['response'].text}")

    assert context["response"].status_code == 200


@then("the response status should be 401")
def validate_status_401(context):

    assert context["response"].status_code == 401


@then("the response status should be 404")
def validate_status_404(context):

    assert context["response"].status_code == 404

# customer validation 

@then("the data array should be non-empty")
def validate_non_empty_customers(context):

    data = context["response"].json()
    print(f"Data received: {data}")

    assert isinstance(data, dict)

    assert len(data) > 0


@then(parsers.parse('the reported total should match the DB count of "customers"'))
def validate_customer_count(context,db_client):

    api_data = context["response"].json()

    db_count = db_client.execute_query(
        CUSTOMER_COUNT
    )[0]["customer_count"]

    print("API RESPONSE:", api_data)
    print("DB COUNT:", db_count)

    assert api_data["total"] == db_count


@then("the reported total should match the active customers DB count")
def validate_active_customer_count(context,db_client):

    api_data = context["response"].json()

    db_count = db_client.execute_query(
        ACTIVE_CUSTOMER_COUNT
    )[0]["active_customer_count"]

    print(f"API returned {api_data['total']} active customers, DB count is {db_count}")
    

    assert api_data["total"] == db_count

# filter checks

@then(parsers.parse('every record should have "{field}" equal to "{value}"'))
def validate_field_value(context,field,value):

    data = context["response"].json().get("data", [])
    print(f"data received: {data}")

    for record in data:
        print(f"Validating record: {record}")

        #assert field in record

        assert (record[field]).lower() == value.lower()


@then(parsers.parse('every record field "{field}" should contain "{search_text}"'))
def validate_search_results(context,field,search_text):

    data = context["response"].json().get("data", [])

    for record in data:

        #assert field in record

        actual_value = str(record[field]).upper()

        assert search_text.upper() in actual_value

# Customer ID validation

@then(parsers.parse('the returned customer should have "id" equal to 5959'))
def validate_customer_id(context,expected_id=5959):

    customer = context["response"].json().get("customer", {})

    print(f"Validating customer ID: {customer.get('id')} against expected ID: {expected_id}")


    assert customer.get('id') == expected_id


@then(parsers.parse("the returned customer should match the DB row for customer id {customer_id:d}"))
def validate_customer_against_db(context,db_client,customer_id):

    api_customer = context["response"].json().get("customer", {})

    db_customer = db_client.execute_query(
        CUSTOMER_BY_ID,
        (customer_id,)
    )

    assert len(db_customer) == 1

    db_customer = db_customer[0]

    assert api_customer.get('id') == db_customer["id"]

    if "name" in api_customer and "name" in db_customer:
        assert api_customer.get("name") == db_customer["name"]

    if "email" in api_customer and "email" in db_customer:
        assert api_customer.get("email") == db_customer["email"]

    if "status" in api_customer and "status" in db_customer:
        assert api_customer.get("status") == db_customer["status"]

# Error message validation

@then("the response should contain an error message")
def validate_error_message(context):

    response_json = context["response"].json()

    assert "error" in response_json

    assert response_json["error"]



