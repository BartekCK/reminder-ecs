import { z } from "zod";
import { isoDateSchema } from "../validation";

export const domainEventPayloadSchema = z.strictObject({
	id: z.string().uuid(),
	name: z.string(),
	version: z.number().int(),
	entityId: z.string().uuid(),
	sequence: z.number().int().gte(0),
	metadata: z.object({
		traceId: z.string().uuid(),
		generatedAt: isoDateSchema,
		commandName: z.string(),
	}),
	data: z.any(),
});

export type IDomainEventPayload = z.infer<typeof domainEventPayloadSchema>;
