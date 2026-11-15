Feature: @product/infrastructure-http version export

  Scenario: Package exposes its manifest version
    Given the @product/infrastructure-http package is imported
    When a caller reads VERSION
    Then it matches package.json version
