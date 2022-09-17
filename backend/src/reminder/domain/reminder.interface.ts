export interface IReminder {
  delete: () => any;
  markAsResolved: () => any;
  updateNote: () => any;
  updateExecutionDate: () => any;
}

export interface ReminderProps {
  id: string;
  note: string;
  plannedExecutionDate?: Date;
  executedAt: Date | null;
  userId: string;
}
