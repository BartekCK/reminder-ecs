import { CreateReminderHandler } from "./CreateReminderHandler";
import { reminderRepository } from "../../../infrastructure/repositories";

const createReminderHandler = new CreateReminderHandler(reminderRepository);

export { createReminderHandler };
