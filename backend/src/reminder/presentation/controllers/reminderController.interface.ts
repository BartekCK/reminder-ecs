import { IActiveReminderPropsDto } from "../dto/ActiveReminder";
import { HttpRequest, HttpResponse } from "../../../common/http";
import { INewReminderPropsDto } from "../dto/NewReminder";
import { ZodError } from "zod";

export interface IReminderController {
  getActiveReminders: (
    req: HttpRequest,
    res: HttpResponse<IActiveReminderPropsDto>
  ) => Promise<void>;

  postCreateReminder: (
    req: HttpRequest<INewReminderPropsDto>,
    res: HttpResponse<IActiveReminderPropsDto | ZodError>
  ) => Promise<void>;
}
