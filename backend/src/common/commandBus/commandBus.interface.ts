import { ICommand } from "./command.interface";
import { Result } from "../error-handling";

export interface ICommandBus {
  execute: <Command extends ICommand, R extends Result>(command: Command) => R;
}
