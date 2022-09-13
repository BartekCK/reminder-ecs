import { IReminderController } from "./reminderController.interface";
import { IActiveReminderPropsDto } from "../dto/ActiveReminder";
import { HttpRequest, HttpResponse } from "../../../common/http";
import { INewReminderPropsDto, newReminderPropsSchema } from "../dto/NewReminder";
import { ZodError } from "zod";

export class ReminderController implements IReminderController {
  async getActiveReminders(
    req: HttpRequest,
    res: HttpResponse<IActiveReminderPropsDto>
  ): Promise<void> {
    res.status(200).send({ message: "Ala ma kota", date: new Date() });
  }

  async postCreateReminder(
    req: HttpRequest<INewReminderPropsDto>,
    res: HttpResponse<IActiveReminderPropsDto | ZodError>
  ): Promise<void> {
    const bodyResult = newReminderPropsSchema.safeParse(req.body);

    if (!bodyResult.success) {
      res.send(bodyResult.error).status(400);
      return;
    }

    const bodyData = bodyResult.data;

    res.status(201).send(bodyData);
  }
}
