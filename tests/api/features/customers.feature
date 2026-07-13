@customers

Feature: Customers API

  Background:
    Given  I am authenticated

  Scenario: Get all customers 
    When I GET "/customers"
    Then the response status should be 200
    And the data array should be non-empty
    And the reported total should match the DB count of "customers"

  Scenario: Filter active customers 
    When I GET "/customers?status=active"
    Then the response status should be 200
    And every record should have "status" equal to "active"
    And the reported total should match the active customers DB count

  Scenario: Search by name
    When I GET "/customers?search=JOHN"
    Then the response status should be 200
    And every record field "name" should contain "JOHN"

  Scenario: Get customer by ID
    When I GET "/customers/5959"
    Then the response status should be 200
    And the returned customer should have "id" equal to 5959
    And the returned customer should match the DB row for customer id 5959

  Scenario: Invalid customer ID
    When I GET "/customers/99999"
    Then the response status should be 404
    And the response should contain an error message

  Scenario: No auth token
    When I GET "/customers" without an auth token
    Then the response status should be 401