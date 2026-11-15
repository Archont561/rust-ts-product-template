Feature: product-domain version export

  Scenario: Crate exposes its manifest version
    Given the product-domain crate is compiled
    When a caller reads VERSION
    Then it matches CARGO_PKG_VERSION
