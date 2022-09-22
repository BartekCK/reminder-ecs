import { ReminderController } from "./ReminderController";
import { IReminderController } from "./reminderController.interface";
import { commandBus } from "../../../core/command-bus";

const reminderController: IReminderController = new ReminderController(commandBus);

export { reminderController };
