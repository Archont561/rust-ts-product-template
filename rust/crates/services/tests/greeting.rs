use product_contracts::{
    GreetingRequest, GreetingResponse, ServiceError, ServiceRequest, ServiceResponse,
};
use product_services::{MAX_NAME_LEN, ProductServices};

#[test]
fn greets_world_by_default_and_for_blank_names() {
    let services = ProductServices::new("test-runtime");

    let omitted = services
        .greet(GreetingRequest { name: None })
        .expect("default greeting succeeds");
    assert_eq!(
        omitted,
        GreetingResponse {
            message: "Hello, World!".to_string(),
            platform: "test-runtime",
            version: product_services::VERSION,
        }
    );

    let blank = services
        .greet(GreetingRequest {
            name: Some("   ".to_string()),
        })
        .expect("blank name falls back to World");
    assert_eq!(blank.message, "Hello, World!");
}

#[test]
fn trims_valid_recipient_names() {
    let services = ProductServices::new("test-runtime");
    let response = services
        .greet(GreetingRequest {
            name: Some("  Ada Lovelace  ".to_string()),
        })
        .expect("trimmed name succeeds");

    assert_eq!(response.message, "Hello, Ada Lovelace!");
    assert_eq!(response.platform, "test-runtime");
}

#[test]
fn rejects_control_chars_and_overlong_names() {
    let services = ProductServices::new("test-runtime");

    let ctrl = services.greet(GreetingRequest {
        name: Some("Ada\nLovelace".to_string()),
    });
    assert!(matches!(
        ctrl,
        Err(ServiceError::InvalidInput { field: "name", .. })
    ));

    let too_long = services.greet(GreetingRequest {
        name: Some("a".repeat(MAX_NAME_LEN + 1)),
    });
    assert!(matches!(
        too_long,
        Err(ServiceError::InvalidInput { field: "name", .. })
    ));
}

#[test]
fn dispatches_single_door_requests() {
    let services = ProductServices::new("dispatch-runtime");

    let ok = services.dispatch(ServiceRequest::Hello(GreetingRequest {
        name: Some("Rust".to_string()),
    }));
    assert!(matches!(
        ok,
        ServiceResponse::Hello(GreetingResponse { ref message, .. }) if message == "Hello, Rust!"
    ));

    let err = services.dispatch(ServiceRequest::Hello(GreetingRequest {
        name: Some("bad\0input".to_string()),
    }));
    assert!(matches!(
        err,
        ServiceResponse::Error(ServiceError::InvalidInput { field: "name", .. })
    ));
}
