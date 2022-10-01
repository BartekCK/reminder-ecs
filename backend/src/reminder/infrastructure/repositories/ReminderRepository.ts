import {
	GetByIdResult,
	GetByIdSuccess,
	IReminderRepository,
	SaveReminderResult,
	SaveReminderSuccess,
} from "../../application/repositories";
import { IReminder, Reminder } from "../../domain";
import { WriteRequest } from "@aws-sdk/client-dynamodb/dist-types/models/models_0";
import { IDatabaseClient, IEventDBItem, IEventDBMapper } from "../../../common/database";
import { DomainEvent } from "../../../common/events";
import { IReminderEventPayload } from "../../domain/events";

export class ReminderRepository implements IReminderRepository {
	constructor(
		private readonly client: IDatabaseClient,
		private readonly mapper: IEventDBMapper,
		private readonly dbName: string
	) {}

	async save(reminder: IReminder): Promise<SaveReminderResult> {
		const events = reminder.getChanges();

		const putRequests: WriteRequest[] = events.map((event) => ({
			PutRequest: {
				Item: this.mapper.mapDomainEventIntoEventItem(event),
			},
		}));

		await this.client.batchWrite({
			RequestItems: { [this.dbName]: putRequests },
		});

		return SaveReminderSuccess.create({ reminderId: reminder.getId() });
	}

	async getById(id: string): Promise<GetByIdResult> {
		const result = await this.client.query({
			TableName: this.dbName,
			Select: "ALL_ATTRIBUTES",
			KeyConditionExpression: "entityId = :entityId",
			ExpressionAttributeValues: {
				":entityId": id,
			},
			ScanIndexForward: true,
		});

		if (!result.Items || !result.Items.length) {
			return GetByIdSuccess.create({ reminder: null });
		}

		const domainEvents: DomainEvent[] = result.Items.map((item) =>
			this.mapper.mapEventItemIntoDomainEvent(item as IEventDBItem)
		);

		const applyResult = Reminder.apply(
			domainEvents as DomainEvent<IReminderEventPayload>[]
		);

		if (applyResult.isFailure()) {
			//TODO: Implement results for apply method
			throw new Error("Not implemented yet");
		}

		const { reminder } = applyResult.getData();

		return GetByIdSuccess.create({ reminder });
	}
}
