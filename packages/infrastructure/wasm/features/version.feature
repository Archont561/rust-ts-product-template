Feature: @product/infrastructure-wasm version export

  Scenario: Package exposes its manifest version
    Given the @product/infrastructure-wasm package is imported
    When a caller reads VERSION
    Then it matches package.json version
