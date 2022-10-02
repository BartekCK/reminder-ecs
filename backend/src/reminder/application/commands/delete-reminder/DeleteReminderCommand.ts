import { z } from "zod";
import { ICommand } from "../../../../common/command-bus";

export const deleteReminderCommandPayloadSchema = z.object({
	userId: z.string().uuid(),
	traceId: z.string().uuid(),
	reminderId: z.string().uuid(),
});

export type IDeleteReminderCommand = z.infer<typeof deleteReminderCommandPayloadSchema> &
	ICommand;

export class DeleteReminderCommand implements IDeleteReminderCommand {
	readonly traceId: string;
	readonly userId: string;
	readonly reminderId: string;

	constructor({ reminderId, userId, traceId }: IDeleteReminderCommand) {
		this.reminderId = reminderId;
		this.traceId = traceId;
		this.userId = userId;
	}
}
