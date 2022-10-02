import {
	InvalidEventFailure,
	OutcomeFailure,
	OutcomeSuccess,
} from "../../../common/error-handling";

export class ReminderDeleteSuccess extends OutcomeSuccess {}
export class ReminderDeleteFailure extends OutcomeFailure {
	static reminderAlreadyDelete(reminderId: string): ReminderDeleteFailure {
		return new ReminderDeleteFailure({
			errorScope: "DOMAIN_ERROR",
			errorCode: "CAN_NOT_DELETE_REMINDER",
			reason: "Reminder was already removed",
			context: {
				reminderId,
			},
		});
	}
}
export type ReminderDeleteResult =
	| ReminderDeleteSuccess
	| ReminderDeleteFailure
	| InvalidEventFailure;
