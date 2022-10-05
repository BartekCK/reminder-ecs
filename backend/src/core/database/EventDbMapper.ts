import { DomainEvent } from "../../common/events";
import { IEventDBItem, IEventDBMapper } from "../../common/database";

export class EventDBMapper implements IEventDBMapper {
	mapDomainEventIntoEventItem(domainEvent: DomainEvent): IEventDBItem {
		const eventPayload = domainEvent.getPayload();

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

	mapEventItemIntoDomainEvent(dbItem: IEventDBItem): DomainEvent {
		const payload = {
			id: dbItem.id,
			name: dbItem.name,
			version: dbItem.version,
			entityId: dbItem.entityId,
			sequence: dbItem.sequence,
			metadata: {
				traceId: dbItem.metadata.traceId,
				commandName: dbItem.metadata.commandName,
				generatedAt: new Date(dbItem.metadata.generatedAt),
			},
			data: JSON.parse(dbItem.data),
		};

		return new DomainEvent(payload);
	}
}
