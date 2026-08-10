@transactions

Feature: Transactions Screen

  Background:
    Given I am logged into the portal

  Scenario: Filter by type
    Given I am on the transactions screen
    When I select type = Credit
    Then All visible rows show transaction_type = Credit

  Scenario: Filter by status
    Given I am on the transactions screen
    When I select status = Completed
    Then All visible rows show status = Completed
  
  
  Scenario: Filter by date range
    Given I am on the transactions screen
    When I set a from_date and to_date and apply
    Then All visible transaction dates fall within the range


  Scenario: Clear filters
    Given Filters are applied on transactions screen
    When I click the Clear button
    Then All transactions are shown again and filters are reset