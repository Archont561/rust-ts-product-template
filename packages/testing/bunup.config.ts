import { type DefineConfigItem, defineConfig } from "bunup";

const config: DefineConfigItem = defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  sourceBase: "src",
  format: "esm",
  target: "bun",
  packages: "external",
  splitting: false,
  clean: true,
  dts: { inferTypes: true },
}) as DefineConfigItem;

export default config;
