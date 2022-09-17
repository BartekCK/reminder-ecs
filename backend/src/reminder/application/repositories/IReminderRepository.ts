export interface IReminderRepository {
  save: () => Promise<void>;
}
