Feature: Complete Todo

  Scenario: Given a Todo exists and is not completed. When user completes the Todo. Then the Todo is Completed.
    Given a Todo exists and is not completed
    When user completes the Todo
    Then the Todo is Completed