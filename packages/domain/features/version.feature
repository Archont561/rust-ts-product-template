Feature: @product/domain version export

  Scenario: Package exposes its manifest version
    Given the @product/domain package is imported
    When a caller reads VERSION
    Then it matches package.json version
