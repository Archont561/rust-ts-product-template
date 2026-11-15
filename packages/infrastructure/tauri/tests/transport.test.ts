import { describe, expect, test } from "bun:test";
import {
  createAutoTauriTransport,
  createTauriTransport,
  hasTauriRuntime,
  type TauriInvoke,
} from "@/src/index";

describe("@product/infrastructure-tauri injectable transport", () => {
  test("invokes single-door rpc command via injected invoke double", async () => {
    let seenCommand = "";
    let seenArgs: Record<string, unknown> | undefined;
    const fakeInvoke: TauriInvoke = async <T>(command: string, args?: Record<string, unknown>) => {
      seenCommand = command;
      seenArgs = args;
      return {
        status: "ok",
        data: { message: "Hello, Desktop!", platform: "desktop-tauri", version: "0.1.0" },
      } as T;
    };

    const transport = createTauriTransport({ invoke: fakeInvoke, platform: "desktop-tauri" });
    const res = await transport.dispatch({ method: "hello", name: "Desktop" });

    expect(seenCommand).toBe("rpc");
    expect(seenArgs).toEqual({ request: { method: "hello", name: "Desktop" } });
    expect(res.status === "ok" && res.data.message).toBe("Hello, Desktop!");
  });

  test("degrades cleanly in browser previews when __TAURI_INTERNALS__ is absent", async () => {
    const fakeInvoke: TauriInvoke = async () => {
      throw new Error("should not be called in browser preview");
    };

    expect(hasTauriRuntime({})).toBe(false);
    expect(hasTauriRuntime({ __TAURI_INTERNALS__: {} })).toBe(true);

    const previewTransport = createAutoTauriTransport({
      invoke: fakeInvoke,
      globalObject: {},
    });
    expect(previewTransport.connected).toBe(false);
    const res = await previewTransport.dispatch({ method: "hello" });
    expect(res.status === "err" && res.error.code).toBe("disconnected");
  });

  test("rejects malformed IPC envelopes and maps invoke rejection to disconnected", async () => {
    const malformed = createTauriTransport({
      invoke: async <T>() => ({ broken: true }) as T,
    });
    const rBad = await malformed.dispatch({ method: "hello" });
    expect(rBad.status === "err" && rBad.error.code).toBe("unavailable");

    const crashed = createTauriTransport({
      invoke: async () => {
        throw new Error("ipc closed");
      },
    });
    const rErr = await crashed.dispatch({ method: "hello" });
    expect(rErr.status === "err" && rErr.error.code).toBe("disconnected");
  });
});
