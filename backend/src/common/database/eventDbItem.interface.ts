import { NativeAttributeValue } from "@aws-sdk/util-dynamodb/dist-types/models";

export interface IEventDBItem extends Record<string, NativeAttributeValue> {
	id: string;
	name: string;
	version: number;
	entityId: string;
	sequence: number;
	metadata: {
		traceId: string;
		commandName: string;
		generatedAt: string;
	};
	data: string;
}
