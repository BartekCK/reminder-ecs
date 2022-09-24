import { ReminderRepository } from "../../reminder/infrastructure/repositories/ReminderRepository";
import {
  CommandBus,
  ICommand,
  ICommandBus,
  ICommandHandler,
} from "../../common/command-bus";
import { Result } from "../../common/error-handling";
import { CreateReminderCommand } from "../../reminder/application/commands/create-reminder/CreateReminderCommand";
import { CreateReminderHandler } from "../../reminder/application/commands/create-reminder/CreateReminderHandler";
import { DynamoDB } from "aws-sdk";
import { IReminderRepository } from "../../reminder/application/repositories";
import { EnvironmentLocalStore } from "../../common/environment/application/EnviromentLocalStore";
import { SsmEnvironment } from "../../common/environment/infrastructure/SsmEnviroment";
import { OsEnvironment } from "../../common/environment/infrastructure/OsEnviroment";
import { ReminderController } from "../../reminder/presentation/controllers/ReminderController";
import { ReminderRouter } from "../../reminder/presentation/reminderRouter";

export interface IDependencies {
  reminderRepository: IReminderRepository;
  commandBus: ICommandBus;
  reminderRouter: ReminderRouter;
  environmentLocalStore: EnvironmentLocalStore;
}

interface IDependencyInjector {}

export class DependencyInjector {
  private static singleton: DependencyInjector | null;
  private readonly props: IDependencies;

  private constructor(props: {
    reminderRouter: ReminderRouter;
    commandBus: ICommandBus;
    reminderRepository: IReminderRepository;
    environmentLocalStore: EnvironmentLocalStore;
  }) {
    this.props = props;
    DependencyInjector.singleton = this;
  }

  public static async create(data?: IDependencyInjector): Promise<DependencyInjector> {
    if (DependencyInjector.singleton) {
      return DependencyInjector.singleton;
    }

    const environmentLocalStore = await EnvironmentLocalStore.create(
      process.env.NODE_ENV === "production" ? new SsmEnvironment() : new OsEnvironment()
    );

    const databaseClient: DynamoDB = new DynamoDB({
      region: environmentLocalStore.getAwsRegion(),
      endpoint: environmentLocalStore.getDynamoDbUrl(),
    });

    const reminderRepository = new ReminderRepository(databaseClient);

    const createReminderHandler = new CreateReminderHandler(reminderRepository);

    const commandMap: Map<string, ICommandHandler<ICommand, Promise<Result>>> = new Map([
      [CreateReminderCommand.name, createReminderHandler],
    ]);

    const commandBus: ICommandBus = new CommandBus(commandMap);

    const reminderController = new ReminderController(commandBus);

    const reminderRouter = new ReminderRouter(reminderController);

    return new DependencyInjector({
      commandBus,
      reminderRepository,
      reminderRouter,
      environmentLocalStore,
    });
  }

  public static getDependencies(): IDependencies {
    if (!DependencyInjector.singleton) {
      throw new Error("Static method 'create' wasn't invoke");
    }

    return DependencyInjector.singleton.props;
  }
}
