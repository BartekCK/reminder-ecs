import { v4 } from "uuid";
import { IReminder, ReminderId, ReminderProps } from "./reminder.interface";
import {
  ReminderCreateFailure,
  ReminderCreateResult,
  ReminderCreateSuccess,
} from "./behaviours/createResult";
import { AggregateRoot } from "../../common/domain";
import { CreateReminderDomainEvent } from "./events/createReminder/CreateReminderDomainEvent";

export class Reminder extends AggregateRoot implements IReminder {
  private constructor(private readonly props: ReminderProps) {
    super();
  }

  public static create(
    data: {
      note: string;
      plannedExecutionDate?: Date;
      userId: string;
    },
    context: { traceId: string; commandName: string }
  ): ReminderCreateResult {
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

    const reminder = new Reminder({
      id: v4() as ReminderId,
      userId,
      note,
      plannedExecutionDate,
      executedAt: null,
    });

    const event = CreateReminderDomainEvent.create(
      {
        note,
        userId,
        plannedExecutionDate,
      },
      {
        entityId: reminder.getId(),
        sequence: 0,
        traceId: context.traceId,
        commandName: context.commandName,
      }
    );

    if (event.isFailure()) {
      return event;
    }

    reminder.addDomainEvent(event.getData());

    return ReminderCreateSuccess.create({
      reminder,
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
