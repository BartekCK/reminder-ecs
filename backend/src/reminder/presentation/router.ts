import { Router } from "express";
import { reminderController } from "./controllers";

const reminderRouter = Router();

reminderRouter.get("/", reminderController.getActiveReminders);
reminderRouter.post("/", reminderController.postCreateReminder);

export default reminderRouter;
