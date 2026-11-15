<script lang="ts">
import { createProductClient } from "@product/application";
import type { GreetingResponse } from "@product/contracts";
import { createAutoTauriTransport } from "@product/infrastructure-tauri";
import { invoke } from "@tauri-apps/api/core";
import { onMount } from "svelte";

const client = createProductClient(createAutoTauriTransport({ invoke, platform: "desktop-tauri" }));

let greeting = $state<GreetingResponse | null>(null);
let error = $state<string | null>(null);

onMount(async () => {
  try {
    greeting = await client.greet({ name: "Desktop" });
  } catch (cause) {
    error = cause instanceof Error ? cause.message : String(cause);
  }
});
</script>

<main class="p-8 font-sans">
  <h1 class="text-2xl font-bold">Desktop (Tauri v2)</h1>
  {#if greeting}
    <p>{greeting.message} ({greeting.platform} · v{greeting.version})</p>
  {:else if error}
    <p class="text-amber-700">{error}</p>
  {:else}
    <p>Invoking desktop RPC service…</p>
  {/if}
</main>
