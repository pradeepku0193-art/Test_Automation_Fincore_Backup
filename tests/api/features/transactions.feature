@transactions

Feature: Transactions API
    Background:
        Given  I am authenticated

  Scenario: Get all transactions
    When I GET "/transactions"
    Then the response status code should be 200
    And the returned transactions should match the DB count


  Scenario: Filter by type
    When I GET "/transactions?type=credit"
    Then the response status code should be 200
    And the all returned records should have "transaction_type" equal to "credit"
  
  Scenario: Filter by date range
    When I GET "/transactions?from_date=X&to;_date=Y"
    Then the response status code should be 200
    And the all returned transaction_dates fall within the range
  
  Scenario: Filter by amount range
    When I GET "/transactions?min_amount=100&max_amount=500"
    Then the response status code should be 200
    And the All returned amounts are between 100 and 500
  
  Scenario: Filter by account
    When I GET "/transactions?account_id=5"
    Then the response status code should be 200
    And the All returned records belong to account_id 5
    And the returned records should match the DB count
  