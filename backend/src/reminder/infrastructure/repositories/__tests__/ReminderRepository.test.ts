import { ReminderRepository } from "../ReminderRepository";
import {
	GetByIdResult,
	GetByIdSuccess,
	IReminderRepository,
	SaveReminderSuccess,
} from "../../../application/repositories";
import { EventDBMapper } from "../../../../core/database";
import { EnvironmentLocalStore } from "../../../../common/environment/application/EnviromentLocalStore";
import { OsEnvironment } from "../../../../common/environment/infrastructure/OsEnviroment";
import { ReminderMock } from "../../../../__tests__/mocks";
import { DatabaseClient, IDatabaseClient } from "../../../../common/database";
import { assertSuccess } from "../../../../common/tests";
import { IReminderEventPayload } from "../../../domain/events";
import { v4 } from "uuid";

describe("ReminderRepository", () => {
	let reminderRepository: IReminderRepository;
	let dbClient: IDatabaseClient;
	let environmentLocalStore: EnvironmentLocalStore;

	beforeAll(async () => {
		environmentLocalStore = await EnvironmentLocalStore.create(new OsEnvironment());
		const tableName = environmentLocalStore.getEventsTableName();

		dbClient = new DatabaseClient({ env: environmentLocalStore });
		await dbClient.createEventTable(tableName);

		const mapper = new EventDBMapper();

		reminderRepository = new ReminderRepository(dbClient, mapper, tableName);
	});

	afterAll(async () => {
		const tableName = environmentLocalStore.getEventsTableName();
		await dbClient.deleteEventTable(tableName);
		dbClient.destroy();
	});

	describe("Given reminder domain", () => {
		const reminder = ReminderMock.create();

		describe("when reminderRepository was called", () => {
			let saveResult: SaveReminderSuccess;

			beforeAll(async () => {
				const result = await reminderRepository.save(reminder);

				assertSuccess(result);

				saveResult = result;
			});

			it("then result should contain domain id", async () => {
				expect(saveResult.getData().reminderId).toEqual(reminder.getId());
			});

			it("then should save all events", async () => {
				const sendResult = await dbClient.query({
					TableName: environmentLocalStore.getEventsTableName(),
					ExpressionAttributeValues: {
						":entityId": reminder.getId(),
					},
					KeyConditionExpression: "entityId = :entityId",
				});

				expect(sendResult.Items).toBeDefined();
				expect(sendResult.Items).toHaveLength(1);
			});
		});
	});

	describe("Given saved reminder events stream", () => {
		const reminder = ReminderMock.create();

		beforeAll(async () => {
			await reminderRepository.save(reminder);
		});

		describe("when reminder stream was found by entityId", () => {
			let saveResult: GetByIdSuccess;

			beforeAll(async () => {
				const result = await reminderRepository.getById(reminder.getId());
				assertSuccess(result);
				saveResult = result;
			});

			it("then result should be Reminder", async () => {
				expect(saveResult.getData().reminder?.getProps()).toEqual(reminder.getProps());
			});
		});

		describe("when reminder stream was NOT found by entityId", () => {
			let saveResult: GetByIdSuccess;
			const unknownId = v4();

			beforeAll(async () => {
				const result = await reminderRepository.getById(unknownId);
				assertSuccess(result);
				saveResult = result;
			});

			it("then result should be Reminder", async () => {
				expect(saveResult.getData().reminder).toBeNull();
			});
		});
	});
});
