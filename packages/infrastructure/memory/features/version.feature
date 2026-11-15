Feature: @product/infrastructure-memory version export

  Scenario: Package exposes its manifest version
    Given the @product/infrastructure-memory package is imported
    When a caller reads VERSION
    Then it matches package.json version
