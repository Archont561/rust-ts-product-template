import { version } from "@/package.json" with { type: "json" };

export { assertNever } from "@/src/assert-never";

export const VERSION: string = version;
