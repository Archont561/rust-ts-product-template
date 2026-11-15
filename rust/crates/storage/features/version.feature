Feature: product-storage version export

  Scenario: Crate exposes its manifest version
    Given the product-storage crate is compiled
    When a caller reads VERSION
    Then it matches CARGO_PKG_VERSION
