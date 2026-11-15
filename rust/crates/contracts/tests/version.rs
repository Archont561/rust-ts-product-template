#[test]
fn exports_manifest_version() {
    assert_eq!(product_contracts::VERSION, env!("CARGO_PKG_VERSION"));
    assert_ne!(product_contracts::VERSION, "");
}
