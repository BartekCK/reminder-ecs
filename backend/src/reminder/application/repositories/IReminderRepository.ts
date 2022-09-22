import { IReminder, ReminderId } from "../../domain";
import { DatabaseFailure, OutcomeSuccess } from "../../../common/error-handling";

export class SaveReminderSuccess extends OutcomeSuccess<{ reminderId: ReminderId }> {
  private constructor(reminderId: ReminderId) {
    super({ reminderId });
  }

  public static create(reminderId: ReminderId) {
    return new SaveReminderSuccess(reminderId);
  }
}
export type SaveReminderResult = SaveReminderSuccess | DatabaseFailure;

export interface IReminderRepository {
  save: (reminder: IReminder) => Promise<SaveReminderResult>;
}
