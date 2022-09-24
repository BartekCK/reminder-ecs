import { OutcomeSuccess } from "../../../../common/error-handling";
import { DomainEvent } from "../../../../common/events";
import { ICreateReminderDomainEvent } from "./createReminderProps.interface";

export class CreateReminderDomainEventSuccess extends OutcomeSuccess<
  DomainEvent<ICreateReminderDomainEvent>
> {}
