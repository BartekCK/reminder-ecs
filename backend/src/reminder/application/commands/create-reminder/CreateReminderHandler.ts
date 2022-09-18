import { z, ZodError } from "zod";
import { OutcomeFailure, OutcomeSuccess } from "../../../../common/error-handling";
import { IReminderRepository } from "../../repositories";
import { Reminder } from "../../../domain";
import { ICommand, ICommandHandler } from "../../../../common/commandBus";
import {
  createReminderCommandPayloadSchema,
  ICreateReminderCommand,
} from "./CreateReminderCommand";

interface IContext {
  originalErrorScope: string;
  originalErrorCode: string;
  originalReason: string;
  originalContext: any;
}

export class CreateReminderCommandFailure extends OutcomeFailure<IContext | ZodError> {
  public static invalidPayload(zodError: ZodError) {
    return new CreateReminderCommandFailure({
      errorScope: "APPLICATION_ERROR",
      errorCode: "INVALID_COMMAND_PAYLOAD",
      reason: "",
      context: zodError,
    });
  }

  public static domainError(failure: OutcomeFailure) {
    const { errorScope, errorCode, context, reason } = failure.getError();

    return new CreateReminderCommandFailure({
      errorCode: "",
      errorScope: "APPLICATION_ERROR",
      reason: "",
      context: {
        originalErrorScope: errorScope,
        originalErrorCode: errorCode,
        originalReason: reason,
        originalContext: context,
      },
    });
  }
}

export class CreateReminderCommandSuccess extends OutcomeSuccess {
  public static create(): CreateReminderCommandSuccess {
    return new CreateReminderCommandSuccess(null);
  }
}

export type CreateReminderCommandResult =
  | CreateReminderCommandSuccess
  | CreateReminderCommandFailure;

export class CreateReminderHandler
  implements
    ICommandHandler<ICreateReminderCommand, Promise<CreateReminderCommandResult>>
{
  constructor(private readonly reminderRepository: IReminderRepository) {}

  async handle(command: ICommand): Promise<CreateReminderCommandResult> {
    const validationResult = createReminderCommandPayloadSchema.safeParse(command);

    if (!validationResult.success) {
      return CreateReminderCommandFailure.invalidPayload(validationResult.error);
    }

    const createReminderResult = Reminder.create(validationResult.data);

    if (createReminderResult.isFailure()) {
      return CreateReminderCommandFailure.domainError(createReminderResult);
    }

    const { reminder } = createReminderResult.getData();

    const saveResult = await this.reminderRepository.save(reminder);

    // TODO: Check if save is not error

    return CreateReminderCommandSuccess.create();
  }
}
