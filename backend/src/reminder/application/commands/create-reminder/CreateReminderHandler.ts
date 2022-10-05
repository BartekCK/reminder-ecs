import {
	DatabaseFailure,
	InvalidEventFailure,
	OutcomeSuccess,
} from "../../../../common/error-handling";
import { IReminderRepository } from "../../repositories";
import { Reminder } from "../../../domain";
import { ICommand, ICommandHandler } from "../../../../common/command-bus";
import {
	CreateReminderCommand,
	createReminderCommandPayloadSchema,
	ICreateReminderCommand,
} from "./CreateReminderCommand";
import { InvalidPayloadFailure } from "../../../../common/error-handling/InvalidPayloadFailure";
import { ReminderCreateFailure } from "../../../domain/behaviours/createResult";

export class CreateReminderCommandSuccess extends OutcomeSuccess<null> {}
export type CreateReminderCommandFailure =
	| DatabaseFailure
	| InvalidPayloadFailure
	| ReminderCreateFailure
	| InvalidEventFailure;

export type CreateReminderCommandResult =
	| CreateReminderCommandSuccess
	| CreateReminderCommandFailure;

type Dependencies = {
	reminderRepository: IReminderRepository;
};

export class CreateReminderHandler
	implements
		ICommandHandler<ICreateReminderCommand, Promise<CreateReminderCommandResult>>
{
	private readonly reminderRepository: IReminderRepository;

	constructor(dependencies: Dependencies) {
		this.reminderRepository = dependencies.reminderRepository;
	}

	async handle(command: ICommand): Promise<CreateReminderCommandResult> {
		const validationResult = createReminderCommandPayloadSchema.safeParse(command);

		if (!validationResult.success) {
			return InvalidPayloadFailure.create(validationResult.error);
		}

		const createReminderResult = Reminder.create(validationResult.data, {
			traceId: command.traceId,
			commandName: CreateReminderCommand.name,
		});

		if (createReminderResult.isFailure()) {
			return createReminderResult;
		}

		const { reminder } = createReminderResult.getData();

		const saveResult = await this.reminderRepository.save(reminder);

		if (saveResult.isFailure()) {
			return saveResult;
		}

		return CreateReminderCommandSuccess.create(null);
	}
}
