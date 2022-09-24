import { z } from "zod";
import { isoDateSchema } from "../../../common/validation/isoDate.schema";

export const newReminderPropsSchema = z.object({
  userId: z.string(),
  note: z.string(),
  plannedExecutionDate: isoDateSchema,
});

export type INewReminderPropsDto = z.infer<typeof newReminderPropsSchema>;
