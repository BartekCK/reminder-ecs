import { ReminderRepository } from "../ReminderRepository";
import { IReminderRepository } from "../../../application/repositories";
// import { DynamoDB } from "aws-sdk";
import {
  CreateTableCommand,
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
  ScanCommandOutput,
} from "@aws-sdk/client-dynamodb";

describe("ReminderRepository", () => {
  let reminderRepository: IReminderRepository;

  const client = new DynamoDBClient({
    endpoint: "http://localhost:4566",
    region: "eu-central-1",
  });

  beforeAll(() => {
    // reminderRepository = new ReminderRepository();
  });

  describe('GIVEN "reminder" object', () => {
    describe("WHEN save first time", () => {
      it("THEN should persist reminder", async () => {
        // await reminderRepository.save();
      });
    });
  });

  it("createTable", async () => {
    await client.send(
      new CreateTableCommand({
        TableName: "subscriptions",
        AttributeDefinitions: [
          {
            AttributeName: "productId",
            AttributeType: "S",
          },
          {
            AttributeName: "customerEmail",
            AttributeType: "S",
          },
        ],
        KeySchema: [
          {
            KeyType: "HASH",
            AttributeName: "productId",
          },
          {
            KeyType: "RANGE",
            AttributeName: "customerEmail",
          },
        ],
        BillingMode: "PAY_PER_REQUEST",
      })
    );
  });

  it("should create items", async () => {
    await client.send(
      new PutItemCommand({
        TableName: "subscriptions",
        Item: {
          productId: {
            S: "1",
          },

          customerEmail: {
            S: "Bartek",
          },

          createdAt: {
            S: new Date().toDateString(),
          },
        },
      })
    );

    await client.send(
      new PutItemCommand({
        TableName: "subscriptions",
        Item: {
          productId: {
            S: "1",
          },

          customerEmail: {
            S: "Marek",
          },

          createdAt: {
            S: new Date().toDateString(),
          },
        },
      })
    );

    await client.send(
      new PutItemCommand({
        TableName: "subscriptions",
        Item: {
          productId: {
            S: "1",
          },

          customerEmail: {
            S: "Wojtek",
          },

          createdAt: {
            S: new Date().toDateString(),
          },
        },
      })
    );

    await client.send(
      new PutItemCommand({
        TableName: "subscriptions",
        Item: {
          productId: {
            S: "2",
          },

          customerEmail: {
            S: "Wojtek",
          },

          createdAt: {
            S: new Date().toDateString(),
          },
        },
      })
    );
    await client.send(
      new PutItemCommand({
        TableName: "subscriptions",
        Item: {
          productId: {
            S: "3",
          },

          customerEmail: {
            S: "Bartek",
          },

          createdAt: {
            S: new Date().toDateString(),
          },
        },
      })
    );
  });

  it("Add date to table", async () => {
    let lastItem: any = null;
    let isMoreItems = false;

    const batchSize: number = 3;

    do {
      const queryResult = await client.send(
        new ScanCommand({
          TableName: "subscriptions",
          ProjectionExpression: "productId, customerEmail",
          FilterExpression: "productId = :productId",
          ExpressionAttributeValues: {
            ":productId": { S: "1" },
          },
          Limit: batchSize,
          ExclusiveStartKey: lastItem,
        })
      );

      lastItem = queryResult.Items
        ? queryResult.Items[queryResult.Items.length - 1]
        : null;
      isMoreItems =
        (queryResult?.Items && queryResult.Items?.length >= batchSize) || false;
      console.log(queryResult.Items);
    } while (isMoreItems && lastItem);
  });
});
