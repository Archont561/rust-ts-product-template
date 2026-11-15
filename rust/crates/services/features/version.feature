Feature: Package version metadata

  Scenario: Crate exposes its manifest version
    Given the product-services crate is compiled
    When VERSION is read
    Then VERSION matches the Cargo package version
