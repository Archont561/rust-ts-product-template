Feature: @product/infrastructure-extension version export

  Scenario: Package exposes its manifest version
    Given the @product/infrastructure-extension package is imported
    When a caller reads VERSION
    Then it matches package.json version
