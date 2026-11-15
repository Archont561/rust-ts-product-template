Feature: @product/features version export

  Scenario: Package exposes its manifest version
    Given the @product/features package is imported
    When a caller reads VERSION
    Then it matches package.json version
