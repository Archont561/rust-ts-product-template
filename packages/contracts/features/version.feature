Feature: @product/contracts version export

  Scenario: Package exposes its manifest version
    Given the @product/contracts package is imported
    When a caller reads VERSION
    Then it matches package.json version
