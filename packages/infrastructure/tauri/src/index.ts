import {
  isServiceResponse,
  type ServiceRequest,
  type ServiceResponse,
  type ServiceTransport,
} from "@product/contracts";
import { version } from "@/package.json" with { type: "json" };

export const VERSION: string = version;

/** Minimal injectable subset of `@tauri-apps/api/core`'s `invoke`. */
export type TauriInvoke = <T>(command: string, args?: Record<string, unknown>) => Promise<T>;

/** Minimal injectable subset of `@tauri-apps/api/event`'s `listen`. */
export type TauriListen = <T>(
  event: string,
  handler: (message: { payload: T }) => void,
) => Promise<() => void>;

export interface TauriTransportOptions {
  readonly invoke: TauriInvoke;
  readonly listen?: TauriListen | undefined;
  readonly command?: string | undefined;
  readonly platform?: string | undefined;
}

export interface AutoTauriTransportOptions extends TauriTransportOptions {
  readonly globalObject?: Record<string, unknown> | undefined;
}

/** Detect whether code is executing inside a Tauri WebView rather than a browser preview. */
export function hasTauriRuntime(
  globalObject: Record<string, unknown> = globalThis as Record<string, unknown>,
): boolean {
  return "__TAURI_INTERNALS__" in globalObject;
}

/**
 * Graceful browser-preview fallback transport when Tauri's WebView bridge is absent
 * (e.g. Vite browser dev or Storybook) so UI never crashes on missing IPC globals.
 */
export function createUnavailableTauriTransport(
  reason = "Tauri runtime is not available in this browser preview",
  platform = "tauri-unavailable",
): ServiceTransport {
  return {
    platform,
    connected: false,
    async dispatch(): Promise<ServiceResponse> {
      return {
        status: "err",
        error: { code: "disconnected", message: reason },
      };
    },
  };
}

/**
 * Injectable Tauri transport shared by both `apps/desktop` and `apps/mobile`.
 * Routes every operation through the single-door `rpc` Tauri command so adding
 * operations never requires widening IPC allowlists.
 */
export function createTauriTransport(options: TauriTransportOptions): ServiceTransport {
  const command = options.command ?? "rpc";
  const platform = options.platform ?? "tauri";

  return {
    platform,
    connected: true,
    async dispatch(request: ServiceRequest): Promise<ServiceResponse> {
      try {
        const raw = await options.invoke<unknown>(command, { request });
        if (!isServiceResponse(raw)) {
          return {
            status: "err",
            error: {
              code: "unavailable",
              message: `Tauri command '${command}' returned an invalid RPC envelope`,
            },
          };
        }
        return raw;
      } catch (cause) {
        return {
          status: "err",
          error: {
            code: "disconnected",
            message: cause instanceof Error ? cause.message : String(cause),
          },
        };
      }
    },
  };
}

/**
 * Construct a real Tauri transport when running inside a Tauri WebView, or
 * degrade cleanly to `createUnavailableTauriTransport()` in browser previews.
 */
export function createAutoTauriTransport(options: AutoTauriTransportOptions): ServiceTransport {
  if (!hasTauriRuntime(options.globalObject)) {
    return createUnavailableTauriTransport(undefined, options.platform ?? "tauri-unavailable");
  }
  return createTauriTransport(options);
}
