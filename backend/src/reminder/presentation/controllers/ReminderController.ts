import { IReminderController } from "./reminderController.interface";
import { IActiveReminderPropsDto } from "../dto/ActiveReminder";
import { HttpRequest, HttpResponse } from "../../../common/http";
import { INewReminderPropsDto, newReminderPropsSchema } from "../dto/NewReminder";
import { ZodError } from "zod";
import { ICommandBus } from "../../../common/command-bus";
import {
  CreateReminderCommand,
  ICreateReminderCommand,
} from "../../application/commands/create-reminder/CreateReminderCommand";
import { CreateReminderCommandResult } from "../../application/commands/create-reminder/CreateReminderHandler";

export class ReminderController implements IReminderController {
  constructor(private readonly commandBus: ICommandBus) {}

  async postCreateReminder(
    req: HttpRequest<INewReminderPropsDto>,
    res: HttpResponse<IActiveReminderPropsDto | ZodError>
  ): Promise<void> {
    const bodyResult = newReminderPropsSchema.safeParse(req.body);

    if (!bodyResult.success) {
      res.status(400).send(bodyResult.error);
      return;
    }

    const result = await this.commandBus.execute<
      ICreateReminderCommand,
      CreateReminderCommandResult
    >(new CreateReminderCommand(bodyResult.data));

    if (result.isFailure()) {
      const error = result.getError();
      error.
    }

    res.status(201).send();
  }
}
