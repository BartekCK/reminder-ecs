import { BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import {
	IReminderRepository,
	SaveReminderResult,
	SaveReminderSuccess,
} from "../../application/repositories";
import { IReminder } from "../../domain";
import { WriteRequest } from "@aws-sdk/client-dynamodb/dist-types/models/models_0";
import { IDatabaseClient, IEventDBMapper } from "../../../common/database";

export class ReminderRepository implements IReminderRepository {
	constructor(
		private readonly client: IDatabaseClient,
		private readonly mapper: IEventDBMapper,
		private readonly dbName: string
	) {}

	async save(reminder: IReminder): Promise<SaveReminderResult> {
		// const events = reminder.getChanges();
		//
		// const putRequests: WriteRequest[] = events.map((event) => ({
		// 	PutRequest: {
		// 		Item: this.mapper.mapDomainEventPayloadIntoEventItem(event.getProps()),
		// 	},
		// }));

		await this.client.batchWrite({
			RequestItems: { [this.dbName]: [{ PutRequest: { Item: { aaa: "dd" } } }] },
		});

		// await this.client.send(
		// 	new BatchWriteItemCommand({
		// 		RequestItems: {
		// 			[this.dbName]: putRequests,
		// 		},
		// 	})
		// );

		return SaveReminderSuccess.create({ reminderId: reminder.getId() });
	}
}
