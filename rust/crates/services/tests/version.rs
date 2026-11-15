#[test]
fn exports_manifest_version() {
    assert_eq!(product_services::VERSION, env!("CARGO_PKG_VERSION"));
    assert_ne!(product_services::VERSION, "");
}
