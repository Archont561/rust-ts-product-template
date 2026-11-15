Feature: product-adapter-wasm version export

  Scenario: Crate exposes its manifest version
    Given the product-adapter-wasm crate is compiled
    When a caller reads VERSION
    Then it matches CARGO_PKG_VERSION
