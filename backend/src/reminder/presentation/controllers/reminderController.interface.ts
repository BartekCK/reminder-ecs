import { HttpRequest, HttpResponse } from "../../../common/http";
import { INewReminderPropsDto } from "../dto/newReminder";
import { DeleteReminderCommandFailure } from "../../application/commands/delete-reminder/DeleteReminderHandler";
import { CreateReminderCommandFailure } from "../../application/commands/create-reminder/CreateReminderHandler";

export interface IReminderController {
	postCreateReminder: (
		req: HttpRequest<INewReminderPropsDto>,
		res: HttpResponse<CreateReminderCommandFailure | null>
	) => Promise<void>;

	deleteReminder: (
		req: HttpRequest<null, { reminderId: string }, { userId: string }>,
		res: HttpResponse<DeleteReminderCommandFailure | null>
	) => Promise<void>;
}
