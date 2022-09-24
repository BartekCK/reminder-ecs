import { ApplicationFailure, OutcomeSuccess } from "../../../../common/error-handling";
import { IReminderRepository } from "../../repositories";
import { Reminder } from "../../../domain";
import { ICommand, ICommandHandler } from "../../../../common/command-bus";
import {
  createReminderCommandPayloadSchema,
  ICreateReminderCommand,
} from "./CreateReminderCommand";

export class CreateReminderCommandSuccess extends OutcomeSuccess<null> {}

export type CreateReminderCommandResult =
  | CreateReminderCommandSuccess
  | ApplicationFailure;

export class CreateReminderHandler
  implements
    ICommandHandler<ICreateReminderCommand, Promise<CreateReminderCommandResult>>
{
  constructor(private readonly reminderRepository: IReminderRepository) {}

  async handle(command: ICommand): Promise<CreateReminderCommandResult> {
    const validationResult = createReminderCommandPayloadSchema.safeParse(command);

    if (!validationResult.success) {
      return ApplicationFailure.invalidPayload(validationResult.error);
    }

    const createReminderResult = Reminder.create(validationResult.data);

    if (createReminderResult.isFailure()) {
      return ApplicationFailure.domainError(createReminderResult);
    }

    const { reminder } = createReminderResult.getData();

    const saveResult = await this.reminderRepository.save(reminder);

    if (saveResult.isFailure()) {
      return ApplicationFailure.infrastructureError(saveResult);
    }

    return CreateReminderCommandSuccess.create(null);
  }
}
