Feature: @product/testing version export

  Scenario: Package exposes its manifest version
    Given the @product/testing package is imported
    When a caller reads VERSION
    Then it matches package.json version
