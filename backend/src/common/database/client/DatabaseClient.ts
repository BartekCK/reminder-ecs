import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import {
	CreateTableCommand,
	DeleteTableCommand,
	DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import { IDatabaseClient } from "./databaseClient.interface";
import { IEnvironmentDatabase } from "./environmentDatabase.interface";
import { VError } from "verror";

type Dependencies = {
	env: IEnvironmentDatabase;
};

export class DatabaseClient extends DynamoDBDocument implements IDatabaseClient {
	private readonly envStore: IEnvironmentDatabase;

	constructor({ env }: Dependencies) {
		const endpoint = env.getDynamoDbUrl();

		if (env.getEnvStage() !== "production" && !endpoint) {
			throw new VError("DynamoDB endpoint url should be defined", {
				env: env.getEnvStage(),
			});
		}

		const dynamoDBClient = new DynamoDBClient({
			region: env.getAwsRegion(),
			endpoint: env.getEnvStage() === "production" ? undefined : (endpoint as string),
		});

		const marshallOptions = {
			// Whether to automatically convert empty strings, blobs, and sets to `null`.
			convertEmptyValues: true, // false, by default.
			// Whether to remove undefined values while marshalling.
			removeUndefinedValues: false, // false, by default.
			// Whether to convert typeof object to map attribute.
			convertClassInstanceToMap: false, // false, by default.
		};

		const unmarshallOptions = {
			// Whether to return numbers as a string instead of converting them to native JavaScript numbers.
			wrapNumbers: false, // false, by default.
		};

		super(dynamoDBClient, { marshallOptions, unmarshallOptions });

		this.envStore = env;
	}

	async createEventTable(tableName: string): Promise<void> {
		await this.send(
			new CreateTableCommand({
				TableName: tableName,
				BillingMode: "PAY_PER_REQUEST",
				KeySchema: [
					{ AttributeName: "entityId", KeyType: "HASH" },
					{ AttributeName: "sequence", KeyType: "RANGE" },
				],
				AttributeDefinitions: [
					{ AttributeName: "entityId", AttributeType: "S" },
					{ AttributeName: "sequence", AttributeType: "N" },
				],
			})
		);
	}

	async deleteEventTable(tableName: string): Promise<void> {
		await this.send(new DeleteTableCommand({ TableName: tableName }));
	}
}
