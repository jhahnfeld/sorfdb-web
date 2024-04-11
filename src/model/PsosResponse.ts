import { z } from "zod";

export const psosResponseScheme = z.object({
  created: z.string(),
  data: z.object({
    files: z.array(z.record(z.string())),
    request: z.record(
      z.object({
        configuration: z.record(z.string()),
        request_id: z.string(),
        source_app: z.string(),
        type: z.string(),
      }),
    ),
  }),
  deleteAt: z.string(),
  id: z.string(),
  lastUpdated: z.string(),
  location: z.string(),
  plan: z.array(
    z.record(
      z.object({
        address: z.string(),
        name: z.null(),
        states: z.array(z.any()),
      }),
    ),
  ),
  state: z.record(z.object({ label: z.null(), value: z.string() })),
});

export const psosResponseSchemeDoku = z.object({
  created: z.string(),
  data: z.object({
    files: z.array(z.record(z.string())),
    request: z.record(
      z.object({
        type: z.string(),
        configuration: z.record(z.string()),
        sequence: z.string(),
      }),
    ),
  }),
  deleteAt: z.string(),
  id: z.string(),
  lastUpdated: z.string(),
  location: z.string(),

  state: z.record(z.string()),
});

export type psosResponse = z.infer<typeof psosResponseScheme>;
