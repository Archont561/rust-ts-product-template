Feature: Transport-independent greeting service

  Background:
    Given a ProductServices instance for "test-runtime"

  Scenario: Default greeting when name is omitted
    When greet is called without a name
    Then the greeting message is "Hello, World!"

  Scenario: Custom greeting trims surrounding whitespace
    When greet is called with "  Ada  "
    Then the greeting message is "Hello, Ada!"

  Scenario: Control characters in name are rejected
    When greet is called with a control character
    Then ServiceError::InvalidInput is returned for field "name"
