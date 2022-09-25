import { OutcomeSuccess } from "../../../../common/error-handling";
import { DomainEvent } from "../../../../common/events";
import { ICreateReminderDomainEventPayload } from "./createReminderPayload.interface";

export class CreateReminderDomainEventSuccess extends OutcomeSuccess<
	DomainEvent<ICreateReminderDomainEventPayload>
> {}
