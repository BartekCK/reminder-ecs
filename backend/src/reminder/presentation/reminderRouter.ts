import { Router } from "express";
import { IReminderController } from "./controllers/reminderController.interface";

export class ReminderRouter {
  private readonly reminderRouter = Router();

  constructor(reminderController: IReminderController) {
    this.reminderRouter.post("/", (req, res) =>
      reminderController.postCreateReminder(req, res)
    );
  }

  getRouter(): Router {
    return this.reminderRouter;
  }
}
