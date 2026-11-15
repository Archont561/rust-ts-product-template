Feature: @product/infrastructure-tauri version export

  Scenario: Package exposes its manifest version
    Given the @product/infrastructure-tauri package is imported
    When a caller reads VERSION
    Then it matches package.json version
