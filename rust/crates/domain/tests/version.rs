#[test]
fn exports_manifest_version() {
    assert_eq!(product_domain::VERSION, env!("CARGO_PKG_VERSION"));
    assert_ne!(product_domain::VERSION, "");
}
