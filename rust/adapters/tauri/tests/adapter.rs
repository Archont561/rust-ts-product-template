use product_adapter_tauri::TauriBridge;
use product_contracts::{GreetingRequest, ServiceRequest, ServiceResponse};

#[test]
fn desktop_and_mobile_share_identical_service_logic() {
    let desktop = TauriBridge::desktop();
    let mobile = TauriBridge::mobile();

    let d = desktop
        .hello(Some("Desktop".to_string()))
        .expect("desktop hello succeeds");
    let m = mobile
        .hello(Some("Mobile".to_string()))
        .expect("mobile hello succeeds");

    assert_eq!(d.message, "Hello, Desktop!");
    assert_eq!(d.platform, "desktop-tauri");
    assert_eq!(m.message, "Hello, Mobile!");
    assert_eq!(m.platform, "mobile-tauri");

    let dispatched = desktop.dispatch(ServiceRequest::Hello(GreetingRequest { name: None }));
    assert!(matches!(dispatched, ServiceResponse::Hello(_)));
}
