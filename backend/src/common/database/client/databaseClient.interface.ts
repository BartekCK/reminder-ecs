import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

export interface IDatabaseClient extends DynamoDBDocument {
	createEventTable: (tableName: string) => Promise<void>;
	deleteEventTable: (tableName: string) => Promise<void>;
}
