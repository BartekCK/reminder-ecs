import {
	DeleteReminderCommandResult,
	DeleteReminderCommandSuccess,
} from "../DeleteReminderHandler";
import { DependencyInjector } from "../../../../../core/dependency-injector";
import { ICommandBus } from "../../../../../common/command-bus";
import { DeleteReminderCommand } from "../DeleteReminderCommand";
import { v4 } from "uuid";
import { IDatabaseClient } from "../../../../../common/database";
import { IReminderRepository } from "../../../repositories";
import { ReminderMock } from "../../../../../__tests__/reminder/mocks";
import { IReminder } from "../../../../domain";
import { assertFailure } from "../../../../../common/tests/assertFailure";
import { assertSuccess } from "../../../../../common/tests";
import {
	InvalidPayloadFailure,
	NotFoundFailure,
	OutcomeFailure,
} from "../../../../../common/error-handling";

describe("Delete reminder handler", () => {
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

	describe("Given correct existed `DeleteReminderCommand`", () => {
		let reminder: IReminder;
		let command: DeleteReminderCommand;

		beforeAll(async () => {
			reminder = ReminderMock.create();
			await reminderRepository.save(reminder);

			command = new DeleteReminderCommand({
				userId: v4(),
				traceId: v4(),
				reminderId: reminder.getId(),
			});
		});

		describe("when command is executed", () => {
			let result: DeleteReminderCommandSuccess;

			beforeAll(async () => {
				const handlerResult = await commandBus.execute<
					DeleteReminderCommand,
					Promise<DeleteReminderCommandResult>
				>(command);

				assertSuccess(handlerResult);

				result = handlerResult;
			});

			it("then should result be success", () => {
				expect(result.isSuccess()).toBeTruthy();
				expect(result.getData()).toEqual(null);
			});

			it("then should save `DeleteReminderDomainEvent` in database", async () => {
				const { Items } = await databaseClient.scan({ TableName: tableName });

				if (!Items || !Items[0]) {
					throw new Error("Items should contain first element");
				}

				expect(
					Items.map(({ name, sequence, entityId }) => ({ name, sequence, entityId }))
				).toEqual([
					{ name: "CreateReminderDomainEvent", entityId: reminder.getId(), sequence: 1 },
					{ name: "DeleteReminderDomainEvent", entityId: reminder.getId(), sequence: 2 },
				]);
			});
		});
	});

	describe("Given correct NOT existed reminderID for`DeleteReminderCommand`", () => {
		let command: DeleteReminderCommand;
		const unknownReminderId = v4();

		beforeAll(async () => {
			command = new DeleteReminderCommand({
				userId: v4(),
				traceId: v4(),
				reminderId: unknownReminderId,
			});
		});

		describe("when command is executed", () => {
			let result: OutcomeFailure;

			beforeAll(async () => {
				const handlerResult = await commandBus.execute<
					DeleteReminderCommand,
					Promise<DeleteReminderCommandResult>
				>(command);

				assertFailure(handlerResult);

				result = handlerResult;
			});

			it("then failure should be InvalidPayloadFailure", () => {
				expect(result).toBeInstanceOf(NotFoundFailure);
			});

			it("then failure should be returned", () => {
				expect(result.isFailure()).toBeTruthy();

				expect(result.getError()).toEqual({
					errorScope: "DOMAIN_ERROR",
					errorCode: "ENTITY_NOT_FOUND",
					reason: "Entity not found",
					context: {
						commandName: "DeleteReminderHandler",
						reminderId: unknownReminderId,
					},
				});
			});
		});
	});

	describe("Given incorrect `DeleteReminderCommand`", () => {
		const command = new DeleteReminderCommand({
			userId: "INCORRECT_USER_ID",
			traceId: v4(),
			reminderId: v4(),
		});

		describe("when command is executed", () => {
			let result: OutcomeFailure;

			beforeAll(async () => {
				jest.spyOn(reminderRepository, "save");

				const handlerResult = await commandBus.execute<
					DeleteReminderCommand,
					Promise<DeleteReminderCommandResult>
				>(command);

				assertFailure(handlerResult);

				result = handlerResult;
			});

			it("then result should be failure", () => {
				expect(result.isFailure()).toBeTruthy();

				expect(result.getError().errorScope).toEqual("DOMAIN_ERROR");
				expect(result.getError().errorCode).toEqual("INCORRECT_COMMAND_PAYLOAD");
			});

			it("then failure should be InvalidPayloadFailure", () => {
				expect(result).toBeInstanceOf(InvalidPayloadFailure);
			});

			it("then repository should not be call", () => {
				expect(reminderRepository.save).not.toBeCalled();
			});
		});
	});
});
