<script lang="ts">
import { createProductClient } from "@product/application";
import type { GreetingResponse } from "@product/contracts";
import { createAutoTauriTransport } from "@product/infrastructure-tauri";
import { invoke } from "@tauri-apps/api/core";
import { impactFeedback } from "@tauri-apps/plugin-haptics";
import { onMount } from "svelte";

const client = createProductClient(createAutoTauriTransport({ invoke, platform: "mobile-tauri" }));

let greeting = $state<GreetingResponse | null>(null);
let error = $state<string | null>(null);

async function greet() {
  try {
    error = null;
    greeting = await client.greet({ name: "Mobile" });
    await impactFeedback("light").catch(() => undefined);
  } catch (cause) {
    error = cause instanceof Error ? cause.message : String(cause);
  }
}

onMount(greet);
</script>

<main class="p-6 font-sans">
  <h1 class="text-2xl font-bold">Mobile (Tauri v2)</h1>
  {#if greeting}
    <p>{greeting.message} ({greeting.platform} · v{greeting.version})</p>
  {:else if error}
    <p class="text-amber-700">{error}</p>
  {:else}
    <p>Invoking mobile RPC service…</p>
  {/if}
</main>
