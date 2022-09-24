import { domainEventPayloadSchema } from "../../../../common/events/domainEvent.interface";
import { z } from "zod";
import { isoDateSchema } from "../../../../common/validation";

export const createReminderDomainEventPayloadSchema = domainEventPayloadSchema.extend({
  payload: z.object({
    note: z.string(),
    plannedExecutionDate: isoDateSchema.optional(),
    userId: z.string().uuid(),
  }),
});

export type ICreateReminderDomainEventPayload = z.infer<
  typeof createReminderDomainEventPayloadSchema
>;
