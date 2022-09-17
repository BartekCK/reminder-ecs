import { v4 } from "uuid";
import { IReminder, ReminderProps } from "./reminder.interface";
import {
  ReminderCreateFailure,
  ReminderCreateResult,
  ReminderCreateSuccess,
} from "./behaviours/createResult";

export class Reminder implements IReminder {
  private constructor(props: ReminderProps) {}

  public static create(data: {
    note: string;
    plannedExecutionDate?: Date;
    userId: string;
  }): ReminderCreateResult {
    const { note, userId, plannedExecutionDate } = data;

    const currentTime = Date.now();

    if (plannedExecutionDate && plannedExecutionDate.getTime() <= currentTime) {
      return ReminderCreateFailure.pastExecution(
        userId,
        plannedExecutionDate,
        new Date(currentTime)
      );
    }

    if (!note.length) {
      return ReminderCreateFailure.noteIsEmpty(userId);
    }

    return ReminderCreateSuccess.create(
      new Reminder({
        id: v4(),
        userId,
        note,
        plannedExecutionDate,
        executedAt: null,
      })
    );
  }

  delete(): any {}

  markAsResolved(): any {}

  updateExecutionDate(): any {}

  updateNote(): any {}
}
