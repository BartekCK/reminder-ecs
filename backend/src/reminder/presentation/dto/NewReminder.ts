import { z } from "zod";
import { isoDateSchema } from "../../../common/validation/isoDate.schema";

export const newReminderPropsSchema = z.object({
  userId: z.string(),
  message: z.string(),
  date: isoDateSchema,
});

export type INewReminderPropsDto = z.infer<typeof newReminderPropsSchema>;

export class NewReminderDto {
  private readonly props: INewReminderPropsDto;

  private constructor(userId: string, message: string, date: Date) {
    this.props = {
      userId,
      message,
      date,
    };
  }

  public static create(userId: string, message: string, date: Date): NewReminderDto {
    return new NewReminderDto(userId, message, date);
  }

  getProps(): INewReminderPropsDto {
    return this.props;
  }
}
