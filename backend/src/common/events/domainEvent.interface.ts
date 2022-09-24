import { z } from "zod";
import { isoDateSchema } from "../validation";

export const domainEventSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  version: z.number().int(),
  entityId: z.string().uuid(),
  sequence: z.number().int().gte(0),
  metadata: z.object({
    traceId: z.string().uuid(),
    generatedAt: isoDateSchema,
  }),
  payload: z.any(),
});

export type IDomainEvent = z.infer<typeof domainEventSchema>;
