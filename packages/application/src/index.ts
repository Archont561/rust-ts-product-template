import {
  type GreetingRequest,
  type GreetingResponse,
  type GreetingService,
  ServiceError,
  type ServiceRequest,
  type ServiceTransport,
} from "@product/contracts";
import { version } from "@/package.json" with { type: "json" };

export const VERSION: string = version;

/** Transport-independent application client backed by any injected `ServiceTransport`. */
export interface ProductClient extends GreetingService {
  readonly transport: ServiceTransport;
  dispatch(request: ServiceRequest): Promise<GreetingResponse>;
}

/**
 * Construct a transport-independent product client.
 *
 * UI and feature modules depend only on this client (or `GreetingService`);
 * composition roots (`apps/*`) inject whichever infrastructure transport matches
 * the runtime (`http`, `tauri`, `wasm`, `extension`, or `memory`).
 */
export function createProductClient(transport: ServiceTransport): ProductClient {
  const dispatch = async (request: ServiceRequest): Promise<GreetingResponse> => {
    const response = await transport.dispatch(request);
    if (response.status === "err") {
      throw new ServiceError(response.error.code, response.error.message, response.error.field);
    }
    return response.data;
  };

  return {
    transport,
    dispatch,
    greet(request: GreetingRequest = {}): Promise<GreetingResponse> {
      return dispatch({ method: "hello", name: request.name });
    },
  };
}
