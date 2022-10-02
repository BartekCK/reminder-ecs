import { faker } from "@faker-js/faker";
import { IEventDBItem } from "../../database";
import { v4 } from "uuid";

export const createEventDbItemMock = (args?: Partial<IEventDBItem>): IEventDBItem => {
	return {
		id: v4(),
		name: faker.lorem.word(),
		version: 1,
		entityId: v4(),
		sequence: faker.datatype.number(),
		metadata: {
			traceId: v4(),
			commandName: faker.lorem.word(),
			generatedAt: faker.date.past().toISOString(),
		},
		data: faker.datatype.json(),
		...args,
	};
};
