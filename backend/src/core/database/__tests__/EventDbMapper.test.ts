import { IEventDBMapper } from "../../../common/database";
import { EventDBMapper } from "../EventDbMapper";
import {
	createDomainEventPayloadMock,
	createEventDbItemMock,
} from "../../../common/tests/mocks";
import { DomainEvent } from "../../../common/events";

describe("Event store db mapper", () => {
	const mapper: IEventDBMapper = new EventDBMapper();

	it("should map IDomainEventPayload into IEventDBItem", () => {
		const domainEvent = new DomainEvent(createDomainEventPayloadMock());
		const eventDBItem = mapper.mapDomainEventIntoEventItem(domainEvent);

		expect(eventDBItem).toEqual({
			id: domainEvent.getPayload().id,
			name: domainEvent.getPayload().name,
			version: domainEvent.getPayload().version,
			entityId: domainEvent.getPayload().entityId,
			sequence: domainEvent.getPayload().sequence,
			metadata: {
				traceId: domainEvent.getPayload().metadata.traceId,
				commandName: domainEvent.getPayload().metadata.commandName,
				generatedAt: domainEvent.getPayload().metadata.generatedAt.toISOString(),
			},
			data: JSON.stringify(domainEvent.getPayload().data),
		});
	});

	it("should map IEventDBItem into IDomainEventPayload", () => {
		const eventDBItem = createEventDbItemMock();
		const domainEvent = mapper.mapEventItemIntoDomainEvent(eventDBItem);

		expect(domainEvent).toBeInstanceOf(DomainEvent);
		expect(domainEvent.getPayload()).toEqual({
			id: eventDBItem.id,
			name: eventDBItem.name,
			version: eventDBItem.version,
			entityId: eventDBItem.entityId,
			sequence: eventDBItem.sequence,
			metadata: {
				traceId: eventDBItem.metadata.traceId,
				commandName: eventDBItem.metadata.commandName,
				generatedAt: new Date(eventDBItem.metadata.generatedAt),
			},
			data: JSON.parse(eventDBItem.data),
		});
	});
});
