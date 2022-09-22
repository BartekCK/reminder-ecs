import { IReminderController } from "./reminderController.interface";
import { IActiveReminderPropsDto } from "../dto/ActiveReminder";
import { HttpRequest, HttpResponse } from "../../../common/http";
import { INewReminderPropsDto, newReminderPropsSchema } from "../dto/NewReminder";
import { ZodError } from "zod";
import { ICommandBus } from "../../../common/command-bus";
import { CreateReminderCommand } from "../../application/commands/create-reminder/CreateReminderCommand";

export class ReminderController implements IReminderController {
  constructor(private readonly commandBus: ICommandBus) {}

  async postCreateReminder(
    req: HttpRequest<INewReminderPropsDto>,
    res: HttpResponse<IActiveReminderPropsDto | ZodError>
  ): Promise<void> {
    const bodyResult = newReminderPropsSchema.safeParse(req.body);

    if (!bodyResult.success) {
      res.send(bodyResult.error).status(400);
      return;
    }

    await this.commandBus.execute(new CreateReminderCommand(bodyResult.data));

    res.status(201).send();
  }
}
