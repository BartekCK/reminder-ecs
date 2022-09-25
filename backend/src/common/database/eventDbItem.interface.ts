import { AttributeValue } from "@aws-sdk/client-dynamodb/dist-types/models/models_0";

export interface IEventDBItem extends Record<string, AttributeValue> {
	id: { S: string };
	name: { S: string };
	version: { N: string };
	entityId: { S: string };
	sequence: { N: string };
	metadata: {
		M: {
			traceId: { S: string };
			commandName: { S: string };
			generatedAt: { S: string };
		};
	};
	data: { S: string };
}
