Feature: @product/ui version export

  Scenario: Package exposes its manifest version
    Given the @product/ui package is imported
    When a caller reads VERSION
    Then it matches package.json version
