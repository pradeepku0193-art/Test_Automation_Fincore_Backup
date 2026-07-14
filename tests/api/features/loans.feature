@Loan

Feature: Loan API
    Background:
        Given I am authenticated
    
    Scenario: Get all loans
        When I GET "/loans"
        Then the response status code should be 200
        And the returned records should match the DB count
    
    Scenario: Filter by status
        When I GET "/loans?status=active"
        Then the response status code should be 200
        And the returned records should have "status" equal to "active"
    
    Scenario: Get loan by ID
        When I GET "/loans/1"
        Then the all fields present including loan_duration_days and emi_amount
    
    Scenario: Verify computed fields
        When I GET "/loans/1"
        Then the loan_duration_days matches end_date - start_date calculation
    
    Scenario: Dashboard summary
        When I GET "/dashboard/summary"
        Then the total_customers and active_loans match DB counts

