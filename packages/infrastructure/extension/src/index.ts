import {
  isServiceResponse,
  type ServiceRequest,
  type ServiceResponse,
  type ServiceTransport,
} from "@product/contracts";
import { version } from "@/package.json" with { type: "json" };

export const VERSION: string = version;

/** Minimal injectable subset of `browser.runtime.sendMessage` / `chrome.runtime.sendMessage`. */
export type ExtensionSendMessage = (message: unknown) => Promise<unknown>;

export interface ExtensionTransportOptions {
  readonly sendMessage: ExtensionSendMessage;
  readonly platform?: string | undefined;
}

/**
 * Injectable MV3 browser-extension transport wrapping `runtime.sendMessage`.
 * Always validates the response payload at the untrusted extension boundary.
 */
export function createExtensionTransport(options: ExtensionTransportOptions): ServiceTransport {
  const platform = options.platform ?? "extension-mv3";

  return {
    platform,
    connected: true,
    async dispatch(request: ServiceRequest): Promise<ServiceResponse> {
      try {
        const raw = await options.sendMessage(request);
        if (!isServiceResponse(raw)) {
          return {
            status: "err",
            error: {
              code: "unavailable",
              message: "Extension background worker returned an invalid RPC envelope",
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
