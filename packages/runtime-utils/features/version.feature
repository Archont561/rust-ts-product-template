Feature: @product/runtime-utils pure runtime helpers and version export

  Scenario: Package exposes its manifest version
    Given the @product/runtime-utils package is imported
    When a caller reads VERSION
    Then it matches package.json version

  Scenario: assertNever rejects an unreachable variant at runtime
    Given an unexpected value bypasses static type checking
    When assertNever is called with that value
    Then it throws a descriptive Error
