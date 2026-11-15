<script lang="ts">
import { createProductClient } from "@product/application";
import type { GreetingResponse } from "@product/contracts";
import { createExtensionTransport } from "@product/infrastructure-extension";
import { onMount } from "svelte";

const client = createProductClient(
  createExtensionTransport({
    sendMessage: (message) => browser.runtime.sendMessage(message),
  }),
);

let greeting = $state<GreetingResponse | null>(null);
let error = $state<string | null>(null);

onMount(async () => {
  try {
    greeting = await client.greet({ name: "Extension" });
  } catch (cause) {
    error = cause instanceof Error ? cause.message : String(cause);
  }
});
</script>

<main class="w-72 p-4 font-sans">
  <h1 class="text-lg font-bold">Browser Extension (MV3)</h1>
  {#if greeting}
    <p>{greeting.message} ({greeting.platform} · v{greeting.version})</p>
  {:else if error}
    <p class="text-amber-700">{error}</p>
  {:else}
    <p>Contacting background worker…</p>
  {/if}
</main>
