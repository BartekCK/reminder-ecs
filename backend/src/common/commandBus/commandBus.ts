import { ICommandBus } from "./commandBus.interface";
import { ICommandHandler } from "./commandHandler.interface";
import { ICommand } from "./command.interface";
import { VError } from "verror";
import { Result } from "../error-handling";

export class CommandBus implements ICommandBus {
  private commandHandlers: Map<
    string,
    ICommandHandler<ICommand, Result | Promise<Result>>
  >;

  constructor(
    commandHandlers: Map<string, ICommandHandler<ICommand, Result | Promise<Result>>>
  ) {
    this.commandHandlers = commandHandlers;
  }

  public execute<Command extends ICommand, R extends Result>(command: Command): R {
    const handler = this.findCommandHandler(command);

    if (!handler) {
      throw new VError("Command for handler doesn't exist", {
        commandName: command.constructor.name,
      });
    }

    return <R>handler.handle(command);
  }

  private findCommandHandler(
    command: ICommand
  ): ICommandHandler<ICommand, Result | Promise<Result>> | null {
    const className = command.constructor.name;

    const handler = this.commandHandlers.get(className);

    return handler || null;
  }
}
