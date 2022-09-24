import {
  InvalidEventFailure,
  OutcomeFailure,
  OutcomeSuccess,
} from "../../../common/error-handling";
import { IReminder } from "../reminder.interface";

interface IContext {
  userId: string;
  plannedExecutionDate?: Date;
  currentTime?: Date;
}

export class ReminderCreateFailure extends OutcomeFailure<IContext> {
  private constructor(context: IContext, errorCode: string, reason: string) {
    super({ errorScope: "DOMAIN_ERROR", errorCode, reason, context });
  }

  static pastExecution(
    userId: string,
    plannedExecutionDate: Date,
    currentTime: Date
  ): ReminderCreateFailure {
    return new ReminderCreateFailure(
      { userId, plannedExecutionDate, currentTime },
      "EXECUTION_DATE_IN_PAST",
      "Planned execution time can't be <= current time"
    );
  }

  static noteIsEmpty(userId: string): ReminderCreateFailure {
    return new ReminderCreateFailure(
      { userId },
      "EMPTY_NOTE",
      "Note can't be empty string"
    );
  }
}

export class ReminderCreateSuccess extends OutcomeSuccess<{ reminder: IReminder }> {}

export type ReminderCreateResult =
  | ReminderCreateSuccess
  | ReminderCreateFailure
  | InvalidEventFailure;
