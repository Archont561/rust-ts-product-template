Feature: @product/build-utils package resolution and version export

  Scenario: Package exposes its manifest version
    Given the @product/build-utils package is imported
    When a caller reads VERSION
    Then it matches package.json version

  Scenario: Caller resolves a workspace package directory without relative traversal
    Given a caller passes a package specifier and its import.meta.url
    When resolvePackageDir is invoked
    Then it returns the absolute directory containing that package's package.json
