import { DynamoDB } from "aws-sdk";
import {
  IReminderRepository,
  SaveReminderResult,
  SaveReminderSuccess,
} from "../../application/repositories";
import { IReminder } from "../../domain";

export class ReminderRepository implements IReminderRepository {
  constructor(private readonly client: DynamoDB) {}

  async save(reminder: IReminder): Promise<SaveReminderResult> {
    // const client = new DynamoDB({
    //   endpoint: "http://localhost:4566",
    //   region: "eu-central-1",
    // });
    //
    // const params: PutItemInput = {
    //   TableName: "reminders",
    //
    //   Item: {
    //     id: {
    //       S: v4(),
    //     },
    //     userId: {
    //       S: v4(),
    //     },
    //     text: {
    //       S: faker.lorem.slug(),
    //     },
    //     createdAt: {
    //       S: new Date().toISOString(),
    //     },
    //   },
    //   ReturnValues: "ALL_NEW",
    // };
    //
    // try {
    //   const result = await client.putItem(params).promise();
    //   console.log(result);
    // } catch (e) {
    //   console.log("ERROR");
    //   console.log(e);
    // }

    return SaveReminderSuccess.create(reminder.getId());
  }
}
