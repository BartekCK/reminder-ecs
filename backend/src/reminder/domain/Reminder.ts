import { v4 } from "uuid";
import { IReminder, ReminderId, ReminderProps } from "./reminder.interface";
import {
  ReminderCreateFailure,
  ReminderCreateResult,
  ReminderCreateSuccess,
} from "./behaviours/createResult";

export class Reminder implements IReminder {
  private constructor(private readonly props: ReminderProps) {}

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

    return ReminderCreateSuccess.create({
      reminder: new Reminder({
        id: v4() as ReminderId,
        userId,
        note,
        plannedExecutionDate,
        executedAt: null,
      }),
    });
  }

  delete(): any {}

  markAsResolved(): any {}

  updateExecutionDate(): any {}

  updateNote(): any {}

  getProps(): ReminderProps {
    return this.props;
  }

  getId(): ReminderId {
    return this.props.id;
  }
}
