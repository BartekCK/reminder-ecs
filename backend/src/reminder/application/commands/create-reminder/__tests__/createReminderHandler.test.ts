import { ReminderRepository } from "../../../../infrastructure/repositories/ReminderRepository";
import {
	CreateReminderCommandResult,
	CreateReminderCommandSuccess,
	CreateReminderHandler,
} from "../CreateReminderHandler";
import { EnvironmentLocalStore } from "../../../../../common/environment/application/EnviromentLocalStore";
import { OsEnvironment } from "../../../../../common/environment/infrastructure/OsEnviroment";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { EventDBMapper } from "../../../../../core/database";
import { DependencyInjector } from "../../../../../core/dependency-injector";
import { ICommandBus } from "../../../../../common/command-bus";
import { CreateReminderCommand } from "../CreateReminderCommand";
import { faker } from "@faker-js/faker";
import { v4 } from "uuid";

describe("Create reminder handler", () => {
	// let reminderRepository: ReminderRepository;
	// let envService: EnvironmentLocalStore;
	//
	// let handler: CreateReminderHandler;
	// let dbClient: DynamoDBClient;

	let commandBus: ICommandBus;
	beforeAll(async () => {
		// envService = await EnvironmentLocalStore.create(new OsEnvironment());
		// dbClient = new DynamoDBClient({
		// 	region: envService.getAwsRegion(),
		// 	endpoint: envService.getDynamoDbUrl(),
		// });
		// const mapper = new EventDBMapper();
		// reminderRepository = new ReminderRepository(
		// 	dbClient,
		// 	mapper,
		// 	envService.getEventsTableName()
		// );
		//
		// handler;
		await DependencyInjector.create();
		commandBus = DependencyInjector.getDependencies().commandBus;
	});

	describe("Given correct `CreateReminderCommand`", () => {
		const command = new CreateReminderCommand({
			note: faker.lorem.slug(),
			plannedExecutionDate: faker.date.future(),
			userId: v4(),
			traceId: v4(),
		});

		describe("when command is executed", () => {
			let result: CreateReminderCommandSuccess;

			beforeAll(async () => {
				const handlerResult = await commandBus.execute<
					CreateReminderCommand,
					Promise<CreateReminderCommandResult>
				>(command);

				if (handlerResult.isFailure()) {
					throw new Error("Should return success");
				}

				result = handlerResult;
			});

			it("should result be success", () => {
				expect(result.isSuccess()).toBeTruthy();
				expect(result.getData()).toEqual(null);
			});

			it("should save `CreateReminderDomainEvent` in database", () => {});
		});
	});
});
