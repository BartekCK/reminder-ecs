import { createDomainEventPayloadMock } from "../../../common/tests/mocks";
import { DomainEvent } from "../../../common/events";
import { Reminder } from "../Reminder";
import { IReminderEventPayload } from "../events";
import { assertFailure } from "../../../common/tests/assertFailure";
import { InvalidEventFailure } from "../../../common/error-handling";
import { CreateReminderDomainEvent } from "../events/createReminder/CreateReminderDomainEvent";
import { ICreateReminderDomainEventPayload } from "../events/createReminder/createReminderPayload.interface";
import { faker } from "@faker-js/faker";
import { v4 } from "uuid";
import { assertSuccess } from "../../../common/tests";
import { ReminderApplySuccess } from "../behaviours/applyResult";

describe("Reminder apply events", () => {
	describe("Given unknown error", () => {
		const unknownEvent = new DomainEvent(createDomainEventPayloadMock());

		describe("when it try to apply", () => {
			let failure: InvalidEventFailure;

			beforeAll(() => {
				const result = Reminder.apply([
					unknownEvent,
				] as DomainEvent<IReminderEventPayload>[]);

				assertFailure(result);

				failure = result;
			});

			it("then should return failure", () => {
				expect(failure.getError()).toEqual({
					context: {
						eventName: unknownEvent.getEventName(),
						eventId: unknownEvent.getPayload().id,
						aggregateName: Reminder.name,
					},
					reason: "Unknown error occurred during applying",
					errorCode: "INVALID_EVENT",
					errorScope: "DOMAIN_ERROR",
				});
			});
		});
	});

	describe("Given events for apply", () => {
		const entityId = v4();
		const userId = v4();
		const note = faker.lorem.slug();
		const plannedExecutionDate = faker.date.future();

		const eventsForApply: DomainEvent<IReminderEventPayload>[] = [
			new DomainEvent<ICreateReminderDomainEventPayload>({
				...createDomainEventPayloadMock(),
				entityId,
				name: CreateReminderDomainEvent.name,
				data: {
					note,
					userId,
					plannedExecutionDate,
				},
				sequence: 1,
			}),
		];

		describe("when Reminder.apply was called", () => {
			let success: ReminderApplySuccess;

			beforeAll(() => {
				const result = Reminder.apply(eventsForApply);
				assertSuccess(result);
				success = result;
			});

			it("then state should be appropriate", () => {
				const { reminder } = success.getData();
				expect(reminder.getProps()).toEqual({
					id: entityId,
					note,
					plannedExecutionDate,
					executedAt: null,
					userId,
				});
			});

			it("then reminder events array should be empty", () => {
				const { reminder } = success.getData();
				expect(reminder.getChanges()).toHaveLength(0);
			});

			it("then reminder events sequence should be set", () => {
				const { reminder } = success.getData();
				expect(reminder.getSequence()).toEqual(eventsForApply.length);
			});
		});
	});
});
