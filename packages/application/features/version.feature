Feature: @product/application version export

  Scenario: Package exposes its manifest version
    Given the @product/application package is imported
    When a caller reads VERSION
    Then it matches package.json version
