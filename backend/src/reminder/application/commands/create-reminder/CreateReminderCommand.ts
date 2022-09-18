import { z } from "zod";
import { isoDateSchema } from "../../../../common/validation/isoDate.schema";
import { ICommand } from "../../../../common/commandBus";

export const createReminderCommandPayloadSchema = z.object({
  note: z.string(),
  plannedExecutionDate: isoDateSchema,
  userId: z.string(),
});

export type ICreateReminderCommand = z.infer<typeof createReminderCommandPayloadSchema> &
  ICommand;

export class CreateReminderCommand implements ICreateReminderCommand {
  readonly note: string;
  readonly plannedExecutionDate: Date;
  readonly userId: string;

  constructor(note: string, plannedExecutionDate: Date, userId: string) {
    this.note = note;
    this.plannedExecutionDate = plannedExecutionDate;
    this.userId = userId;
  }
}
