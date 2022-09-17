import { DynamoDB } from "aws-sdk";
import { IReminderRepository } from "../../application/repositories";
import { PutItemInput } from "aws-sdk/clients/dynamodb";
import { v4 } from "uuid";
import { faker } from "@faker-js/faker";

export class ReminderRepository implements IReminderRepository {
  async save(): Promise<void> {
    const client = new DynamoDB({
      endpoint: "http://localhost:4566",
      region: "eu-central-1",
    });

    const params: PutItemInput = {
      TableName: "reminders",

      Item: {
        id: {
          S: v4(),
        },
        userId: {
          S: v4(),
        },
        text: {
          S: faker.lorem.slug(),
        },
        createdAt: {
          S: new Date().toISOString(),
        },
      },
      ReturnValues: "ALL_NEW",
    };

    try {
      const result = await client.putItem(params).promise();
      console.log(result);
    } catch (e) {
      console.log("ERROR");
      console.log(e);
    }
    return Promise.resolve(undefined);
  }
}
