export type ReminderId = string;

export interface IReminder {
  delete: () => any;
  markAsResolved: () => any;
  updateNote: () => any;
  updateExecutionDate: () => any;
  getProps: () => ReminderProps;
  getId: () => ReminderId;
}

export interface ReminderProps {
  id: ReminderId;
  note: string;
  plannedExecutionDate?: Date;
  executedAt: Date | null;
  userId: string;
}
