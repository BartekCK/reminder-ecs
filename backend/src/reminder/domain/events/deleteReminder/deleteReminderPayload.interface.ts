import { domainEventPayloadSchema } from "../../../../common/events/domainEvent.interface";
import { z } from "zod";
import { isoDateSchema } from "../../../../common/validation";

export const deleteReminderDomainEventPayloadSchema = domainEventPayloadSchema.extend({
	data: z.object({
		deletedAt: isoDateSchema,
	}),
});

export type IDeleteReminderDomainEventPayload = z.infer<
	typeof deleteReminderDomainEventPayloadSchema
>;
