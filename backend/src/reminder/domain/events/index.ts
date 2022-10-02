import { ICreateReminderDomainEventPayload } from "./createReminder/createReminderPayload.interface";
import { IDeleteReminderDomainEventPayload } from "./deleteReminder/deleteReminderPayload.interface";

export type IReminderEventPayload =
	| ICreateReminderDomainEventPayload
	| IDeleteReminderDomainEventPayload;
