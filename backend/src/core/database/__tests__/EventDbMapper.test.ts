import { IEventDBMapper } from "../../../common/database";
import { EventDBMapper } from "../EventDbMapper";
import {
	createDomainEventMock,
	createEventDbItemMock,
} from "../../../common/tests/mocks";

describe("Event store db mapper", () => {
	const mapper: IEventDBMapper = new EventDBMapper();

	it("should map IDomainEventPayload into IEventDBItem", () => {
		const eventDBItem = mapper.mapDomainEventPayloadIntoEventItem(
			createDomainEventMock()
		);

		expect(eventDBItem).toEqual({
			id: expect.any(String),
			name: expect.any(String),
			version: 1,
			entityId: expect.any(String),
			sequence: expect.any(Number),
			metadata: {
				traceId: expect.any(String),
				commandName: expect.any(String),
				generatedAt: expect.any(String),
			},
			data: expect.any(String),
		});
	});

	it("should map IEventDBItem into IDomainEventPayload", () => {
		const eventPayload = mapper.mapEventItemIntoDomainEventPayload(
			createEventDbItemMock()
		);

		expect(eventPayload).toEqual({
			id: expect.any(String),
			name: expect.any(String),
			version: 1,
			entityId: expect.any(String),
			sequence: expect.any(Number),
			metadata: {
				traceId: expect.any(String),
				commandName: expect.any(String),
				generatedAt: expect.any(Date),
			},
			data: expect.any(Object),
		});
	});
});
