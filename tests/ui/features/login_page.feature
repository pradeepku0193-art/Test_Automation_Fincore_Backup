@login

Feature: Login Page

Scenario: Valid login
    Given I am on the login page
    When I enter valid credentials and click Login
    Then I am redirected to the dashboard

Scenario: Invalid password
    Given I am on the login page
    When I enter wrong password and click Login
    Then An error message is displayed on screen

Scenario: Empty form submission
    Given I am on the login page
    When I click Login without entering anything
    Then Validation messages appear for both fields


