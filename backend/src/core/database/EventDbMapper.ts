import { IDomainEventPayload } from "../../common/events";
import { IEventDBMapper, IEventDBItem } from "../../common/database";

export class EventDBMapper implements IEventDBMapper {
	public mapDomainEventPayloadIntoEventItem(
		eventPayload: IDomainEventPayload
	): IEventDBItem {
		return {
			id: eventPayload.id,
			name: eventPayload.name.toString(),
			version: eventPayload.version,
			entityId: eventPayload.entityId,
			sequence: eventPayload.sequence,
			metadata: {
				traceId: eventPayload.metadata.traceId,
				commandName: eventPayload.metadata.commandName,
				generatedAt: eventPayload.metadata.generatedAt.toISOString(),
			},
			data: JSON.stringify(eventPayload.data),
		};
	}
}
