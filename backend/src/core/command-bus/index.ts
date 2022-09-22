import {
  CommandBus,
  ICommand,
  ICommandBus,
  ICommandHandler,
} from "../../common/command-bus";
import { Result } from "../../common/error-handling";
import { CreateReminderCommand } from "../../reminder/application/commands/create-reminder/CreateReminderCommand";
import { createReminderHandler } from "../../reminder/application/commands/create-reminder";

const commandMap: Map<string, ICommandHandler<ICommand, Promise<Result>>> = new Map([
  [CreateReminderCommand.name, createReminderHandler],
]);

const commandBus: ICommandBus = new CommandBus(commandMap);

export { commandBus };
