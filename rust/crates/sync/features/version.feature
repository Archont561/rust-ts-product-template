Feature: product-sync version export

  Scenario: Crate exposes its manifest version
    Given the product-sync crate is compiled
    When a caller reads VERSION
    Then it matches CARGO_PKG_VERSION
