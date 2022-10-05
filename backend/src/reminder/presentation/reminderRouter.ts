import { Router } from "express";
import { IReminderController } from "./controllers/reminderController.interface";
import { HttpRequest, HttpResponse } from "../../common/http";
import { INewReminderPropsDto } from "./dto/newReminder";

export class ReminderRouter {
	private readonly reminderRouter = Router();

	constructor(reminderController: IReminderController) {
		this.reminderRouter.post(
			"/",
			(req: HttpRequest<INewReminderPropsDto>, res: HttpResponse) =>
				reminderController.postCreateReminder(req, res)
		);

		this.reminderRouter.delete(
			"/:reminderId",
			(
				req: HttpRequest<null, { reminderId: string }, { userId: string }>,
				res: HttpResponse
			) => reminderController.deleteReminder(req, res)
		);
	}

	getRouter(): Router {
		return this.reminderRouter;
	}
}
