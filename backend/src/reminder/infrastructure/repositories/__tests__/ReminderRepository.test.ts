import { ReminderRepository } from "../ReminderRepository";
import {
  IReminderRepository,
  SaveReminderSuccess,
} from "../../../application/repositories";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { EventDBMapper } from "../../../../core/database";
import { EnvironmentLocalStore } from "../../../../common/environment/application/EnviromentLocalStore";
import { OsEnvironment } from "../../../../common/environment/infrastructure/OsEnviroment";
import { ReminderMock } from "../../../../__tests__/mocks";

describe("ReminderRepository", () => {
  let reminderRepository: IReminderRepository;
  let dbClient: DynamoDBClient;

  beforeAll(async () => {
    const environmentLocalStore = await EnvironmentLocalStore.create(new OsEnvironment());

    dbClient = new DynamoDBClient({
      region: environmentLocalStore.getAwsRegion(),
      endpoint: environmentLocalStore.getDynamoDbUrl(),
    });

    const mapper = new EventDBMapper();

    reminderRepository = new ReminderRepository(dbClient, mapper);
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
        const sendResult = await dbClient.send(
          new QueryCommand({
            TableName: "events",
            ExpressionAttributeValues: {
              ":entityId": { S: reminder.getId() },
            },
            KeyConditionExpression: "entityId = :entityId",
          })
        );

        expect(sendResult.Items).toBeDefined();
        expect(sendResult.Items).toHaveLength(1);
      });
    });
  });
});
