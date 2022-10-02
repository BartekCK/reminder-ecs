import { InvalidEventFailure, OutcomeSuccess } from "../../../common/error-handling";
import { IReminder } from "../reminder.interface";

export class ReminderApplySuccess extends OutcomeSuccess<{ reminder: IReminder }> {}

export type ReminderApplyResult = ReminderApplySuccess | InvalidEventFailure;
