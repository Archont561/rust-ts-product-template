use product_adapter_wasm::WasmAdapter;

#[test]
fn executes_shared_greeting_service() {
    let adapter = WasmAdapter::new();
    let ok = adapter
        .hello(Some("Browser".to_string()))
        .expect("wasm hello succeeds");
    assert_eq!(ok.message, "Hello, Browser!");
    assert_eq!(ok.platform, "wasm");
}
