@auth
Feature: Authentication API
    As a clinet of the banking API
    I want to authenticate againest /auth/login
    So that I can obtain a JWT token for further requests

Scenario: Valid login
    Given a registered user exists
    When I POST valid credentials to "/auth/login"
    Then the response status should be 200
    And the response should contain a JWT token 

Scenario: Invalid password
    Given a registered user exists
    When I POST wrong password to "/auth/login"
    Then response status should be 401
    And the response should contain an error message 

Scenario: Missing credentials
    Given No credentials are provided
    When I POST empty body to "/auth/login"
    Then response status should be 400
    And the response should contain a validation error