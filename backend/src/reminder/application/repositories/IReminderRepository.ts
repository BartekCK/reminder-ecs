import { IReminder, ReminderId } from "../../domain";
import { DatabaseFailure, OutcomeSuccess } from "../../../common/error-handling";

export class SaveReminderSuccess extends OutcomeSuccess<{ reminderId: ReminderId }> {}
export type SaveReminderResult = SaveReminderSuccess | DatabaseFailure;

export interface IReminderRepository {
	save: (reminder: IReminder) => Promise<SaveReminderResult>;
}
