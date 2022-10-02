import { ApplicationFailure, OutcomeSuccess } from "../../../../common/error-handling";
import { IReminderRepository } from "../../repositories";
import { ICommand, ICommandHandler } from "../../../../common/command-bus";
import {
	DeleteReminderCommand,
	deleteReminderCommandPayloadSchema,
	IDeleteReminderCommand,
} from "./DeleteReminderCommand";

export class DeleteReminderCommandSuccess extends OutcomeSuccess<null> {}

export type DeleteReminderCommandResult =
	| DeleteReminderCommandSuccess
	| ApplicationFailure;

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
			return ApplicationFailure.invalidPayload(validationResult.error);
		}

		//TODO: User id will be here to check access for given reminder
		const { reminderId, userId, traceId } = validationResult.data;

		const getReminderByIdResult = await this.reminderRepository.getById(reminderId);

		if (getReminderByIdResult.isFailure()) {
			return getReminderByIdResult.getError().errorScope === "DOMAIN_ERROR"
				? ApplicationFailure.domainError(getReminderByIdResult)
				: ApplicationFailure.infrastructureError(getReminderByIdResult);
		}

		const { reminder } = getReminderByIdResult.getData();

		if (!reminder) {
			return ApplicationFailure.notFound("Reminder by given id not found", {
				reminderId,
			});
		}

		const deleteReminderResult = reminder.delete({
			traceId,
			commandName: DeleteReminderCommand.name,
		});

		if (deleteReminderResult.isFailure()) {
			return ApplicationFailure.domainError(deleteReminderResult);
		}

		const saveResult = await this.reminderRepository.save(reminder);

		if (saveResult.isFailure()) {
			return ApplicationFailure.infrastructureError(saveResult);
		}

		return DeleteReminderCommandSuccess.create(null);
	}
}
