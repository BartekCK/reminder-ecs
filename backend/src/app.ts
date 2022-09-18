import express, { Express } from "express";
import { environmentLocalStore } from "./common/environment";
import { createReminderHandler } from "./reminder/application/commands/create-reminder";
import { CommandBus, ICommand, ICommandBus, ICommandHandler } from "./common/commandBus";
import {} from "./reminder/application/commands/create-reminder/CreateReminderHandler";
import { CreateReminderCommand } from "./reminder/application/commands/create-reminder/CreateReminderCommand";
import { Result } from "./common/error-handling";

const PORT = process.env.PORT || 8080;
const app: Express = express();

class App {
  public static async main() {
    const envService = await environmentLocalStore;

    const commandMap: Map<string, ICommandHandler<ICommand, Promise<Result>>> = new Map([
      [CreateReminderCommand.name, createReminderHandler],
    ]);

    const commandBus: ICommandBus = new CommandBus(commandMap);
    commandBus.execute(new CreateReminderCommand("Mikel", new Date(), "sss"));

    // app.use(express.json());
    //
    // app.use("/reminders", reminderRouter);
    //
    // app.listen(PORT, () => {
    //   console.log(`App started on port ${PORT} 🚀`);
    // });
  }
}

App.main();
