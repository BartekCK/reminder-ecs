import { ReminderRepository } from "../ReminderRepository";
import { IReminderRepository } from "../../../application/repositories";
import { DynamoDB } from "aws-sdk";
import { CreateTableInput, PutItemInput } from "aws-sdk/clients/dynamodb";

describe("ReminderRepository", () => {
  let reminderRepository: IReminderRepository;

  const client = new DynamoDB({
    endpoint: "http://localhost:4566",
    region: "eu-central-1",
  });

  beforeAll(() => {
    reminderRepository = new ReminderRepository();
  });

  describe('GIVEN "reminder" object', () => {
    describe("WHEN save first time", () => {
      it("THEN should persist reminder", async () => {
        // await reminderRepository.save();
      });
    });
  });

  it("createTable", async () => {
    const createTableInput: CreateTableInput = {
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
    };

    try {
      await client.createTable(createTableInput).promise();
    } catch (e) {
      console.log(e);
    }
  });

  it("Add date to table", async () => {
    // const params1: PutItemInput = {
    //   TableName: "subscriptions",
    //   Item: {
    //     productId: {
    //       S: "1",
    //     },
    //
    //     customerEmail: {
    //       S: "bartek",
    //     },
    //
    //     createdAt: {
    //       S: new Date().toDateString(),
    //     },
    //   },
    // };
    //
    // await client.putItem(params1).promise();

    // const params2: PutItemInput = {
    //   TableName: "subscriptions",
    //   Item: {
    //     productId: {
    //       S: "2",
    //     },
    //
    //     customerEmail: {
    //       S: "Wojtek",
    //     },
    //
    //     createdAt: {
    //       S: `${Date.now()}`,
    //     },
    //   },
    // };
    //
    // await client.putItem(params2).promise();

    // const getResult = await client
    //   .getItem({
    //     TableName: "subscriptions",
    //     Key: {
    //       productId: { S: "2" },
    //       customerEmail: { S: "Wojtek" },
    //     },
    //     ReturnConsumedCapacity: "TOTAL",
    //   })
    //   .promise();
    //
    // console.log(getResult);

    // const scanResult = await client
    //   .scan({
    //     TableName: "subscriptions",
    //     FilterExpression: "productId = :productId",
    //     ExpressionAttributeValues: {
    //       ":productId": { S: "1" },
    //     },
    //   })
    //   .promise();
    //
    // console.log(scanResult.Items);

    const queryResult = await client
      .query({
        TableName: "subscriptions",
        ExpressionAttributeValues: {
          ":productId": { S: "1" },
        },
        KeyConditionExpression: "productId = :productId",
        Limit: 1,
        // ExclusiveStartKey: {
        //   productId: {
        //     S: "1",
        //   },
        //   customerEmail: {
        //     S: "Wojtek",
        //   },
        // },
      })
      .promise();

    console.log(queryResult.Items);
  });
});
