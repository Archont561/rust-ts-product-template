import { version } from "@/package.json" with { type: "json" };

export const VERSION: string = version;

/** Input payload for the transport-independent greeting operation. */
export interface GreetingRequest {
  readonly name?: string | undefined;
}

/** Output payload returned by the greeting operation across every transport. */
export interface GreetingResponse {
  readonly message: string;
  readonly platform: string;
  readonly version: string;
}

/** Stable snake_case error codes shared across Rust and TypeScript boundaries. */
export type ServiceErrorCode = "invalid_input" | "unavailable" | "disconnected";

/** Wire representation of a structured service error. */
export interface ServiceErrorPayload {
  readonly code: ServiceErrorCode;
  readonly message: string;
  readonly field?: string | undefined;
}

/** Typed runtime error raised by transport-independent clients and adapters. */
export class ServiceError extends Error {
  readonly code: ServiceErrorCode;
  readonly field?: string | undefined;

  constructor(code: ServiceErrorCode, message: string, field?: string) {
    super(message);
    this.name = "ServiceError";
    this.code = code;
    if (field !== undefined) {
      this.field = field;
    }
  }
}

/** Single-door transport-independent request envelope. */
export type ServiceRequest = {
  readonly method: "hello";
  readonly name?: string | undefined;
};

/** Single-door transport-independent response envelope. */
export type ServiceResponse =
  | { readonly status: "ok"; readonly data: GreetingResponse }
  | { readonly status: "err"; readonly error: ServiceErrorPayload };

/**
 * Minimal transport contract implemented by every infrastructure package
 * (`memory`, `http`, `tauri`, `wasm`, `extension`).
 */
export interface ServiceTransport {
  readonly platform: string;
  readonly connected: boolean;
  dispatch(request: ServiceRequest): Promise<ServiceResponse>;
}

/** High-level transport-independent product service capability. */
export interface GreetingService {
  greet(request?: GreetingRequest): Promise<GreetingResponse>;
}

/** Injectable clock capability for deterministic tests and WASM compatibility. */
export interface Clock {
  now(): number;
}

/** Runtime boundary guard validating an untrusted greeting payload. */
export function isGreetingResponse(value: unknown): value is GreetingResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.message === "string" &&
    typeof candidate.platform === "string" &&
    typeof candidate.version === "string"
  );
}

/** Runtime boundary guard validating an untrusted single-door RPC response. */
export function isServiceResponse(value: unknown): value is ServiceResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  if (candidate.status === "ok") {
    return isGreetingResponse(candidate.data);
  }
  if (
    candidate.status === "err" &&
    typeof candidate.error === "object" &&
    candidate.error !== null
  ) {
    const err = candidate.error as Record<string, unknown>;
    return (
      (err.code === "invalid_input" || err.code === "unavailable" || err.code === "disconnected") &&
      typeof err.message === "string"
    );
  }
  return false;
}
