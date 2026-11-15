import type { ServiceRequest, ServiceResponse } from "@product/contracts";
import { VERSION } from "@product/infrastructure-extension";
import { createMemoryTransport } from "@product/infrastructure-memory";

const transport = createMemoryTransport({ platform: "extension-mv3", version: VERSION });

function isServiceRequest(value: unknown): value is ServiceRequest {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    candidate.method === "hello" &&
    (candidate.name === undefined || typeof candidate.name === "string")
  );
}

/**
 * Ephemeral MV3 background worker — holds no durable state in memory.
 * Validates incoming messages at the boundary and delegates to the shared transport.
 */
export default defineBackground(() => {
  browser.runtime.onMessage.addListener(
    (message: unknown): Promise<ServiceResponse> | undefined => {
      if (!isServiceRequest(message)) {
        return undefined;
      }
      return transport.dispatch(message);
    },
  );
});
