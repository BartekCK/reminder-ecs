import { z } from "zod";
import { isoDateSchema } from "../../../../common/validation/isoDate.schema";
import { ICommand } from "../../../../common/command-bus";

export const createReminderCommandPayloadSchema = z.object({
	note: z.string(),
	plannedExecutionDate: isoDateSchema,
	userId: z.string().uuid(),
	traceId: z.string().uuid(),
});

export type ICreateReminderCommand = z.infer<typeof createReminderCommandPayloadSchema> &
	ICommand;

export class CreateReminderCommand implements ICreateReminderCommand {
	readonly traceId: string;
	readonly note: string;
	readonly plannedExecutionDate: Date;
	readonly userId: string;

	constructor({ note, plannedExecutionDate, userId, traceId }: ICreateReminderCommand) {
		this.traceId = traceId;
		this.note = note;
		this.plannedExecutionDate = plannedExecutionDate;
		this.userId = userId;
	}
}
