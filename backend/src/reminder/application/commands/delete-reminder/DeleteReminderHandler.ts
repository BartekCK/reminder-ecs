import {
	DatabaseFailure,
	InvalidEventFailure,
	OutcomeSuccess,
} from "../../../../common/error-handling";
import { IReminderRepository } from "../../repositories";
import { ICommand, ICommandHandler } from "../../../../common/command-bus";
import {
	DeleteReminderCommand,
	deleteReminderCommandPayloadSchema,
	IDeleteReminderCommand,
} from "./DeleteReminderCommand";
import { NotFoundFailure } from "../../../../common/error-handling/NotFoundFailure";
import { ReminderDeleteFailure } from "../../../domain/behaviours/deleteResult";
import { InvalidPayloadFailure } from "../../../../common/error-handling/InvalidPayloadFailure";

export class DeleteReminderCommandSuccess extends OutcomeSuccess<null> {}

export type DeleteReminderCommandFailure =
	| InvalidPayloadFailure
	| InvalidEventFailure
	| DatabaseFailure
	| NotFoundFailure
	| ReminderDeleteFailure;

export type DeleteReminderCommandResult =
	| DeleteReminderCommandSuccess
	| DeleteReminderCommandFailure;

type Dependencies = {
	reminderRepository: IReminderRepository;
};

export class DeleteReminderHandler
	implements
		ICommandHandler<IDeleteReminderCommand, Promise<DeleteReminderCommandResult>>
{
	private readonly reminderRepository: IReminderRepository;

	constructor(dependencies: Dependencies) {
		this.reminderRepository = dependencies.reminderRepository;
	}

	async handle(command: ICommand): Promise<DeleteReminderCommandResult> {
		const validationResult = deleteReminderCommandPayloadSchema.safeParse(command);

		if (!validationResult.success) {
			return InvalidPayloadFailure.create(validationResult.error);
		}

		const { reminderId, traceId } = validationResult.data;

		const getReminderByIdResult = await this.reminderRepository.getById(reminderId);

		if (getReminderByIdResult.isFailure()) {
			return getReminderByIdResult;
		}

		const { reminder } = getReminderByIdResult.getData();

		if (!reminder) {
			return NotFoundFailure.create({
				reminderId,
				commandName: DeleteReminderHandler.name,
			});
		}

		const deleteReminderResult = reminder.delete({
			traceId,
			commandName: DeleteReminderCommand.name,
		});

		if (deleteReminderResult.isFailure()) {
			return deleteReminderResult;
		}

		const saveResult = await this.reminderRepository.save(reminder);

		if (saveResult.isFailure()) {
			return saveResult;
		}

		return DeleteReminderCommandSuccess.create(null);
	}
}
