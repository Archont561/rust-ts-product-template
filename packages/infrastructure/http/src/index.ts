import {
  isGreetingResponse,
  type ServiceRequest,
  type ServiceResponse,
  type ServiceTransport,
} from "@product/contracts";
import { version } from "@/package.json" with { type: "json" };

export const VERSION: string = version;

/** Minimal injectable fetch primitive for testability without network I/O. */
export type HttpFetch = (input: string, init?: RequestInit) => Promise<Response>;

export interface HttpTransportOptions {
  readonly baseUrl: string;
  readonly fetch?: HttpFetch | undefined;
  readonly headers?: Record<string, string> | undefined;
  readonly platform?: string | undefined;
}

/**
 * Injectable HTTP transport targeting the Rust Axum backend (`apps/web`).
 * Defaults to `globalThis.fetch` in production while allowing fake fetch
 * doubles in unit tests.
 */
export function createHttpTransport(options: HttpTransportOptions): ServiceTransport {
  const baseUrl = options.baseUrl.replace(/\/+$/, "");
  const platform = options.platform ?? "web-axum";
  const httpFetch: HttpFetch = options.fetch ?? ((input, init) => globalThis.fetch(input, init));

  return {
    platform,
    connected: true,
    async dispatch(request: ServiceRequest): Promise<ServiceResponse> {
      const url = new URL(`${baseUrl}/api/hello`);
      if (request.name !== undefined) {
        url.searchParams.set("name", request.name);
      }

      let response: Response;
      try {
        response = await httpFetch(url.toString(), {
          method: "GET",
          headers: {
            accept: "application/json",
            ...options.headers,
          },
        });
      } catch (cause) {
        return {
          status: "err",
          error: {
            code: "disconnected",
            message: cause instanceof Error ? cause.message : String(cause),
          },
        };
      }

      let body: unknown;
      try {
        body = await response.json();
      } catch {
        return {
          status: "err",
          error: {
            code: "unavailable",
            message: `HTTP ${response.status} returned invalid JSON`,
          },
        };
      }

      if (!response.ok) {
        const message =
          typeof body === "object" &&
          body !== null &&
          "message" in body &&
          typeof (body as { message: unknown }).message === "string"
            ? (body as { message: string }).message
            : `HTTP ${response.status}`;
        return {
          status: "err",
          error: {
            code: response.status === 400 ? "invalid_input" : "unavailable",
            message,
          },
        };
      }

      if (!isGreetingResponse(body)) {
        return {
          status: "err",
          error: {
            code: "unavailable",
            message: "HTTP backend returned an unexpected greeting payload",
          },
        };
      }

      return { status: "ok", data: body };
    },
  };
}
