Feature: Authentication API

Scenario: Valid login
    Given a registered user exists
    When I login with valid credentials
    Then response status should be 200
    And JWT token should be present

Scenario: Invalid password
    Given a registered user exists
    When I login with invalid password
    Then response status should be 401

Scenario: Missing credentials
    When I login with empty credentials
    Then response status should be 400