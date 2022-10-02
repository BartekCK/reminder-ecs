import { faker } from "@faker-js/faker";
import { v4 } from "uuid";
import { IDomainEventPayload } from "../../events";

export const createDomainEventPayloadMock = (
	args?: Partial<IDomainEventPayload>
): IDomainEventPayload => {
	return {
		id: v4(),
		name: faker.lorem.word(),
		version: 1,
		entityId: v4(),
		sequence: faker.datatype.number(),
		metadata: {
			traceId: v4(),
			commandName: faker.lorem.word(),
			generatedAt: faker.date.past(),
		},
		data: JSON.parse(faker.datatype.json()),
		...args,
	};
};
