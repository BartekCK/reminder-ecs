import {
	CreateReminderCommandResult,
	CreateReminderCommandSuccess,
} from "../CreateReminderHandler";
import { DependencyInjector } from "../../../../../core/dependency-injector";
import { ICommandBus } from "../../../../../common/command-bus";
import { CreateReminderCommand } from "../CreateReminderCommand";
import { faker } from "@faker-js/faker";
import { v4 } from "uuid";
import { IDatabaseClient } from "../../../../../common/database";
import { ApplicationFailure } from "../../../../../common/error-handling";
import { IReminderRepository } from "../../../repositories";

describe("Create reminder handler", () => {
	let tableName: string;

	let commandBus: ICommandBus;
	let databaseClient: IDatabaseClient;
	let reminderRepository: IReminderRepository;

	beforeAll(async () => {
		await DependencyInjector.create();
		const {
			commandBus: depCommandBus,
			databaseClient: depDatabaseClient,
			environmentLocalStore: depEnvService,
			reminderRepository: depReminderRepository,
		} = DependencyInjector.getDependencies();
		commandBus = depCommandBus;
		databaseClient = depDatabaseClient;
		reminderRepository = depReminderRepository;
		tableName = depEnvService.getEventsTableName();

		await databaseClient.createEventTable(tableName);
	});

	afterAll(async () => {
		await databaseClient.deleteEventTable(tableName);
		databaseClient.destroy();
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

			it("then should result be success", () => {
				expect(result.isSuccess()).toBeTruthy();
				expect(result.getData()).toEqual(null);
			});

			it("then should save `CreateReminderDomainEvent` in database", async () => {
				const { Items } = await databaseClient.scan({ TableName: tableName });

				if (!Items || !Items[0]) {
					throw new Error("Items should contain first element");
				}

				expect(Items[0]).toEqual(
					expect.objectContaining({ name: "CreateReminderDomainEvent", sequence: 1 })
				);
			});
		});
	});

	describe("Given incorrect `CreateReminderCommand`", () => {
		const command = new CreateReminderCommand({
			note: faker.lorem.slug(),
			plannedExecutionDate: faker.date.future(),
			userId: "INCORRECT_USER_ID",
			traceId: v4(),
		});

		describe("when command is executed", () => {
			let result: ApplicationFailure;

			beforeAll(async () => {
				jest.spyOn(reminderRepository, "save");

				const handlerResult = await commandBus.execute<
					CreateReminderCommand,
					Promise<CreateReminderCommandResult>
				>(command);

				if (handlerResult.isSuccess()) {
					throw new Error("Should return failure");
				}

				result = handlerResult;
			});

			it("then result should be failure", () => {
				expect(result.isFailure()).toBeTruthy();

				expect(result.getError().errorScope).toEqual("APPLICATION_ERROR");
				expect(result.getError().errorCode).toEqual("INCORRECT_COMMAND_PAYLOAD");
			});

			it("then repository should not be call", () => {
				expect(reminderRepository.save).not.toBeCalled();
			});
		});
	});
});
