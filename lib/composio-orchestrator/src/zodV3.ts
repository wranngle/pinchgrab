// @composio/core@0.8.1 validates inputParams via `_def.typeName === "ZodObject"`,
// a zod-v3 internal that v4 dropped. Until the SDK is updated, every zod usage
// in this package goes through this re-export so the swap is one-file later.
export { z } from 'zod/v3';
export type { ZodObject, ZodRawShape, ZodTypeAny } from 'zod/v3';
