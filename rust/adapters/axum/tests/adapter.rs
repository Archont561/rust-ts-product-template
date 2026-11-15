use product_adapter_axum::AxumAdapter;
use product_contracts::ServiceError;

#[test]
fn delegates_hello_and_maps_http_status_codes() {
    let adapter = AxumAdapter::new();
    let ok = adapter
        .hello(Some("Axum".to_string()))
        .expect("valid greeting succeeds");
    assert_eq!(ok.message, "Hello, Axum!");
    assert_eq!(ok.platform, "web-axum");

    let err = adapter
        .hello(Some("bad\nname".to_string()))
        .expect_err("control chars fail validation");
    assert_eq!(AxumAdapter::http_status_code(&err), 400);
    assert_eq!(
        AxumAdapter::http_status_code(&ServiceError::Unavailable {
            reason: "down".to_string()
        }),
        503
    );
}
