#[test]
fn exports_manifest_version() {
    assert_eq!(product_sync::VERSION, env!("CARGO_PKG_VERSION"));
    assert_ne!(product_sync::VERSION, "");
}
