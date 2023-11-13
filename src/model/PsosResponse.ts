import { z } from "zod";

const psosResponse = z.object({
  id: z.string(),
  created: z.string(),
  lastUpdated: z.string(),
  deleteAt: z.string(),
  step: z.string(),
  request: z.record({type: z.string(), configuration: z.record(z.string()), sequence: z.string(),});
  files: z.ZodArray(z.record(z.string()));
  state: z.record(z.string());
});
