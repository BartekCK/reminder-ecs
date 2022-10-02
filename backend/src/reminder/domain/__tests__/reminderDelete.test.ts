import { ReminderMock } from "../../../__tests__/reminder/mocks";
import { v4 } from "uuid";
import { IReminder } from "../reminder.interface";
import { assertFailure } from "../../../common/tests/assertFailure";
import { assertSuccess } from "../../../common/tests";
import { ReminderDeleteSuccess } from "../behaviours/deleteResult";
import { DeleteReminderDomainEvent } from "../events/deleteReminder/DeleteReminderDomainEvent";

describe("Reminder delete behaviour", () => {
	const context = { traceId: v4(), commandName: "DeleteCommand" };

	describe("Given created reminder", () => {
		let reminder: IReminder;

		beforeEach(() => {
			reminder = ReminderMock.create();
			reminder.clearDomainEvents();
		});

		describe("when reminder delete method was called", () => {
			let success: ReminderDeleteSuccess;

			beforeEach(() => {
				const deleteResult = reminder.delete(context);
				assertSuccess(deleteResult);
				success = deleteResult;
			});

			it("then deletedAt state should be set", () => {
				expect(reminder.getProps().deletedAt).toEqual(expect.any(Date));
			});

			it("then delete event should be propagated", () => {
				expect(reminder.getChanges()).toEqual([
					{
						props: {
							data: {
								deletedAt: expect.any(Date),
							},
							entityId: reminder.getId(),
							id: expect.any(String),
							metadata: {
								commandName: context.commandName,
								generatedAt: expect.any(Date),
								traceId: context.traceId,
							},
							name: DeleteReminderDomainEvent.name,
							sequence: 2,
							version: 1,
						},
					},
				]);
			});

			it("then sequence should be changed", () => {
				expect(reminder.getSequence()).toEqual(2);
			});
		});

		describe("when reminder was already removed", () => {
			beforeEach(() => {
				reminder.delete(context);
			});

			it("then should return error", () => {
				const deleteResult = reminder.delete(context);

				assertFailure(deleteResult);

				expect(deleteResult.getError()).toEqual({
					context: {
						reminderId: reminder.getId(),
					},
					errorCode: "CAN_NOT_DELETE_REMINDER",
					errorScope: "DOMAIN_ERROR",
					reason: "Reminder was already removed",
				});
			});
		});
	});
});
