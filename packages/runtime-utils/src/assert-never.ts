/**
 * Compile-time exhaustiveness helper for discriminated unions.
 * Throws if reached at runtime with an unexpected variant.
 */
export function assertNever(value: never, context?: string): never {
  const prefix = context ? `${context}: ` : "";
  throw new Error(`${prefix}Unexpected value: ${String(value)}`);
}
