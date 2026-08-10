@loans

Feature: Loans Screen

  Background:
    Given I am logged into the portal

  Scenario: Loan list loads
    Given I am on the loans screen
    When The page loads
    Then A table with loan records is visible

  Scenario: Filter by status
    Given I am on the loans screen
    When I select status = Active
    Then Only Active loans are shown
  
  Scenario: Filter by type
    Given I am on the loans screen
    When I select type = Personal
    Then Only Personal loans are shown
  
  Scenario: View loan details
    Given I am on the loans screen
    When I click loan row 
    Then Loan detail page shows all fields including computed loan_duration_days and emi_amount
