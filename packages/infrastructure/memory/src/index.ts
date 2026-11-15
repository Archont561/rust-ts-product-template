import type { ServiceRequest, ServiceResponse, ServiceTransport } from "@product/contracts";
import { version } from "@/package.json" with { type: "json" };

export const VERSION: string = version;

const MAX_NAME_LEN = 64;

export interface MemoryTransportOptions {
  readonly platform?: string | undefined;
  readonly version?: string | undefined;
  readonly connected?: boolean | undefined;
}

function hasControlChar(value: string): boolean {
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) {
      return true;
    }
  }
  return false;
}

/**
 * Deterministic in-memory transport mirroring Rust `ProductServices` validation.
 * Ideal for fast BDD/unit tests and Storybook previews with zero I/O.
 */
export function createMemoryTransport(options: MemoryTransportOptions = {}): ServiceTransport {
  const platform = options.platform ?? "memory";
  const transportVersion = options.version ?? VERSION;
  const connected = options.connected ?? true;

  return {
    platform,
    connected,
    async dispatch(request: ServiceRequest): Promise<ServiceResponse> {
      if (!connected) {
        return {
          status: "err",
          error: { code: "disconnected", message: "In-memory transport is disconnected" },
        };
      }

      const trimmed = (request.name ?? "").trim();
      if (trimmed.length > MAX_NAME_LEN) {
        return {
          status: "err",
          error: {
            code: "invalid_input",
            field: "name",
            message: `invalid input for 'name': must be at most ${MAX_NAME_LEN} characters`,
          },
        };
      }
      if (hasControlChar(trimmed)) {
        return {
          status: "err",
          error: {
            code: "invalid_input",
            field: "name",
            message: "invalid input for 'name': must not contain control characters",
          },
        };
      }

      const target = trimmed.length === 0 ? "World" : trimmed;
      return {
        status: "ok",
        data: {
          message: `Hello, ${target}!`,
          platform,
          version: transportVersion,
        },
      };
    },
  };
}
