import { Reminder } from "../Reminder";
import { v4 } from "uuid";
import { faker } from "@faker-js/faker";
import { assertSuccess } from "../../../common/tests";
import { CreateReminderDomainEvent } from "../events/createReminder/CreateReminderDomainEvent";
import { assertFailure } from "../../../common/tests/assertFailure";

describe("Reminder test", () => {
	describe("Given data for create new reminder", () => {
		const context = { traceId: v4(), commandName: "CreateReminderCommand" };

		describe("when data are correct", () => {
			const data = {
				note: faker.lorem.slug(),
				plannedExecutionDate: faker.date.future(1),
				userId: v4(),
			};

			it("then should return success with reminder", () => {
				const result = Reminder.create(data, context);

				assertSuccess(result);

				expect(result.getData().reminder).toBeInstanceOf(Reminder);
			});

			it("then 'CreateReminderDomainEvent' should be added", () => {
				const result = Reminder.create(data, context);

				assertSuccess(result);

				const event = result
					.getData()
					.reminder.getChanges()
					.find((event) => event.getProps().name === CreateReminderDomainEvent.name);

				expect(event).toBeDefined();
			});
		});

		describe("when 'plannedExecutionDate' is in past", () => {
			const data = {
				note: faker.lorem.slug(),
				plannedExecutionDate: faker.date.past(1),
				userId: v4(),
			};

			it("then should return 'pastExecution' error", () => {
				const result = Reminder.create(data, context);

				assertFailure(result);

				expect(result.getError().errorScope).toEqual("DOMAIN_ERROR");
				expect(result.getError().errorCode).toEqual("EXECUTION_DATE_IN_PAST");
			});
		});

		describe("when 'note' is empty", () => {
			const data = {
				note: "",
				userId: v4(),
			};

			it("then should return 'noteIsEmpty' error", () => {
				const result = Reminder.create(data, context);

				assertFailure(result);

				expect(result.getError().errorScope).toEqual("DOMAIN_ERROR");
				expect(result.getError().errorCode).toEqual("EMPTY_NOTE");
			});
		});
	});
});
