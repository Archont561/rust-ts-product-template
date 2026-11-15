#[test]
fn exports_manifest_version() {
    assert_eq!(product_adapter_axum::VERSION, env!("CARGO_PKG_VERSION"));
    assert_ne!(product_adapter_axum::VERSION, "");
}
