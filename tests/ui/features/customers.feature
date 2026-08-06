@customers

Feature: Customers Screen

  Background:
    Given I am logged into the portal

  Scenario: Customer list loads
    Given I am on the customers screen
    When The page loads
    Then A table with customer records is visible

  Scenario: Search by name
    Given I am on the customers screen
    When I type a name in the search box
    Then Only matching customers are shown in the table

  Scenario: Filter by status
    Given I am on the customers screen
    When I select a status from the filter dropdown
    Then All visible rows show that status value

  Scenario: View customer detail
    Given I am on the customers screen
    When I click on a customer row
    Then I navigate to that customer's detail page with all fields visible