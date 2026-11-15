import {
  isServiceResponse,
  type ServiceRequest,
  type ServiceResponse,
  type ServiceTransport,
} from "@product/contracts";
import { version } from "@/package.json" with { type: "json" };

export const VERSION: string = version;

/** Minimal injectable interface satisfied by a compiled `rust/adapters/wasm` module. */
export interface WasmServiceModule {
  dispatch(request: ServiceRequest): ServiceResponse | Promise<ServiceResponse>;
}

export interface WasmTransportOptions {
  readonly load: () => Promise<WasmServiceModule>;
  readonly platform?: string | undefined;
}

/**
 * Injectable lazy-loading WASM transport.
 * Loads and memoizes the `rust/adapters/wasm` module on first dispatch and can
 * be unit-tested in Bun without a compiled `.wasm` binary.
 */
export function createWasmTransport(options: WasmTransportOptions): ServiceTransport {
  const platform = options.platform ?? "wasm";
  let modulePromise: Promise<WasmServiceModule> | null = null;

  const getModule = (): Promise<WasmServiceModule> => {
    if (modulePromise === null) {
      modulePromise = options.load();
    }
    return modulePromise;
  };

  return {
    platform,
    connected: true,
    async dispatch(request: ServiceRequest): Promise<ServiceResponse> {
      try {
        const mod = await getModule();
        const raw = await mod.dispatch(request);
        if (!isServiceResponse(raw)) {
          return {
            status: "err",
            error: {
              code: "unavailable",
              message: "WASM module returned an invalid RPC envelope",
            },
          };
        }
        return raw;
      } catch (cause) {
        modulePromise = null;
        return {
          status: "err",
          error: {
            code: "unavailable",
            message: cause instanceof Error ? cause.message : String(cause),
          },
        };
      }
    },
  };
}
