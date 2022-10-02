import { OutcomeSuccess } from "../../../../common/error-handling";
import { DomainEvent } from "../../../../common/events";
import { IDeleteReminderDomainEventPayload } from "./deleteReminderPayload.interface";

export class DeleteReminderDomainEventSuccess extends OutcomeSuccess<
	DomainEvent<IDeleteReminderDomainEventPayload>
> {}
