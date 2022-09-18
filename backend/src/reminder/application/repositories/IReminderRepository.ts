import { IReminder } from "../../domain";

export interface IReminderRepository {
  save: (reminder: IReminder) => Promise<void>;
}
