import { DomainEvent } from "../../../../common/events";
import {
  createReminderDomainEventSchema,
  ICreateReminderDomainEvent,
} from "./createReminderProps.interface";
import { CreateReminderDomainEventSuccess } from "./CreateReminderDomainEventSuccess";
import { v4 } from "uuid";
import { InvalidEventFailure } from "../../../../common/error-handling";

type CreateReminderDomainEventResult =
  | CreateReminderDomainEventSuccess
  | InvalidEventFailure;

export class CreateReminderDomainEvent extends DomainEvent<ICreateReminderDomainEvent> {
  private constructor(props: ICreateReminderDomainEvent) {
    super(props);
  }

  public static create(
    payload: ICreateReminderDomainEvent["payload"],
    context: { entityId: string; commandId: string; sequence: number }
  ): CreateReminderDomainEventResult {
    const data: ICreateReminderDomainEvent = {
      id: v4(),
      name: CreateReminderDomainEvent.name,
      payload,
      entityId: context.entityId,
      metadata: {
        traceId: context.commandId,
        generatedAt: new Date(),
      },
      sequence: context.sequence + 1,
      version: 1,
    };

    const parseResult = createReminderDomainEventSchema.safeParse(data);

    if (!parseResult.success) {
      return InvalidEventFailure.create({
        name: parseResult.error.name,
        message: parseResult.error.message,
      });
    }

    return CreateReminderDomainEventSuccess.create(new CreateReminderDomainEvent(data));
  }
}
