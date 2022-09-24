import { DomainEvent } from "../../../../common/events";
import {
  createReminderDomainEventPayloadSchema,
  ICreateReminderDomainEventPayload,
} from "./createReminderPayload.interface";
import { CreateReminderDomainEventSuccess } from "./CreateReminderDomainEventSuccess";
import { v4 } from "uuid";
import { InvalidEventFailure } from "../../../../common/error-handling";

type CreateReminderDomainEventResult =
  | CreateReminderDomainEventSuccess
  | InvalidEventFailure;

export class CreateReminderDomainEvent extends DomainEvent<ICreateReminderDomainEventPayload> {
  private constructor(props: ICreateReminderDomainEventPayload) {
    super(props);
  }

  public static create(
    payload: ICreateReminderDomainEventPayload["payload"],
    context: { entityId: string; traceId: string; sequence: number; commandName: string }
  ): CreateReminderDomainEventResult {
    const data: ICreateReminderDomainEventPayload = {
      id: v4(),
      name: CreateReminderDomainEvent.name,
      payload,
      entityId: context.entityId,
      metadata: {
        traceId: context.traceId,
        generatedAt: new Date(),
        commandName: context.commandName,
      },
      sequence: context.sequence + 1,
      version: 1,
    };

    const parseResult = createReminderDomainEventPayloadSchema.safeParse(data);

    if (!parseResult.success) {
      return InvalidEventFailure.create({
        name: parseResult.error.name,
        message: parseResult.error.message,
      });
    }

    return CreateReminderDomainEventSuccess.create(new CreateReminderDomainEvent(data));
  }
}
