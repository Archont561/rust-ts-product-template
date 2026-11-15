import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/module-svelte"],
  manifest: ({ browser }) => {
    const permissions = ["storage", "activeTab"];

    return {
      name: "Product Extension",
      version: "0.1.0",
      description: "Multi-browser Manifest V3 extension sharing the product core.",
      permissions,
      content_security_policy: {
        extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'",
      },
      ...(browser === "firefox"
        ? {
            browser_specific_settings: {
              gecko: {
                id: "product@example.com",
                strict_min_version: "128.0",
              },
            },
          }
        : {}),
    };
  },
});
