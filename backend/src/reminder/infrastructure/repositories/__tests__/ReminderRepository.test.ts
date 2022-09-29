import { ReminderRepository } from "../ReminderRepository";
import {
	IReminderRepository,
	SaveReminderSuccess,
} from "../../../application/repositories";
import { EventDBMapper } from "../../../../core/database";
import { EnvironmentLocalStore } from "../../../../common/environment/application/EnviromentLocalStore";
import { OsEnvironment } from "../../../../common/environment/infrastructure/OsEnviroment";
import { ReminderMock } from "../../../../__tests__/mocks";
import { DatabaseClient, IDatabaseClient } from "../../../../common/database";

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

				if (result.isFailure()) {
					throw new Error("Should return SUCCESS");
				}

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
});
