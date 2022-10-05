import { IReminderController } from "./reminderController.interface";
import { HttpRequest, HttpResponse } from "../../../common/http";
import { INewReminderPropsDto, newReminderPropsSchema } from "../dto/NewReminder";
import { ICommandBus } from "../../../common/command-bus";
import {
	CreateReminderCommand,
	ICreateReminderCommand,
} from "../../application/commands/create-reminder/CreateReminderCommand";
import {
	CreateReminderCommandFailure,
	CreateReminderCommandResult,
} from "../../application/commands/create-reminder/CreateReminderHandler";
import { v4 } from "uuid";
import { deleteReminderPropsSchema } from "../dto/deleteReminder.interface";
import {
	DeleteReminderCommandFailure,
	DeleteReminderCommandResult,
} from "../../application/commands/delete-reminder/DeleteReminderHandler";
import {
	DeleteReminderCommand,
	IDeleteReminderCommand,
} from "../../application/commands/delete-reminder/DeleteReminderCommand";
import { InvalidPayloadFailure } from "../../../common/error-handling/InvalidPayloadFailure";
import { ReminderDeleteFailure } from "../../domain/behaviours/deleteResult";
import { NotFoundFailure } from "../../../common/error-handling/NotFoundFailure";
import { ReminderCreateFailure } from "../../domain/behaviours/createResult";

export class ReminderController implements IReminderController {
	constructor(private readonly commandBus: ICommandBus) {}

	async postCreateReminder(
		req: HttpRequest<INewReminderPropsDto>,
		res: HttpResponse<CreateReminderCommandFailure | null>
	): Promise<void> {
		const bodyResult = newReminderPropsSchema.safeParse(req.body);

		if (!bodyResult.success) {
			res.status(400).send(InvalidPayloadFailure.create(bodyResult.error));
			return;
		}

		const result = await this.commandBus.execute<
			ICreateReminderCommand,
			CreateReminderCommandResult
		>(new CreateReminderCommand({ ...bodyResult.data, traceId: v4() }));

		if (result.isFailure()) {
			switch (result.constructor) {
				case InvalidPayloadFailure:
				case ReminderCreateFailure:
					res.status(400).send(result);
					return;
			}

			res.status(500).send(result);
			return;
		}

		res.status(201).send();
	}

	async deleteReminder(
		req: HttpRequest<null, { reminderId: string }, { userId: string }>,
		res: HttpResponse<DeleteReminderCommandFailure | null>
	): Promise<void> {
		const { userId } = req.query;
		const { reminderId } = req.params;

		const bodyResult = deleteReminderPropsSchema.safeParse({ reminderId, userId });

		if (!bodyResult.success) {
			res.status(400).send(InvalidPayloadFailure.create(bodyResult.error));
			return;
		}

		const result = await this.commandBus.execute<
			IDeleteReminderCommand,
			DeleteReminderCommandResult
		>(new DeleteReminderCommand({ ...bodyResult.data, traceId: v4() }));

		if (result.isFailure()) {
			switch (result.constructor) {
				case InvalidPayloadFailure:
				case ReminderDeleteFailure:
					res.status(400).send(result);
					return;

				case NotFoundFailure:
					res.status(404).send(result);
					return;
			}

			res.status(500).send(result);
			return;
		}

		res.status(204).send(null);
	}
}
