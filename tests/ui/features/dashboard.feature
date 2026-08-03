@dashboard

  Background:
    Given I am on the dashboard

  Scenario: Total Customers card accuracy
    When I read the Total Customers card value
    Then Value matches SELECT COUNT(*) FROM customers


  Scenario: Active Accounts card accuracy
    When I read the Active Accounts card value
    Then Value matches DB count of accounts with status=active


  Scenario: Active Loans card accuracy
    When I read the Active Loans card value
    Then Value matches DB count of loans with status=active




