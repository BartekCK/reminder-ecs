import { IAggregateRoot } from "../../common/domain/aggregateRoot.interface";
import { ReminderDeleteResult } from "./behaviours/deleteResult";

export type ReminderId = string;

export interface IReminder extends IAggregateRoot {
	delete: (context: { traceId: string; commandName: string }) => ReminderDeleteResult;
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
	deletedAt: Date | null;
}
