import { IAggregateRoot } from "../../common/domain/aggregateRoot.interface";

export type ReminderId = string;

export interface IReminder extends IAggregateRoot {
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
