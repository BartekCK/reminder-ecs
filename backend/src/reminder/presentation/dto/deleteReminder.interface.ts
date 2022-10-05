import { z } from "zod";

export const deleteReminderPropsSchema = z.object({
	userId: z.string(),
	reminderId: z.string(),
});

export type IDeleteReminderPropsDto = z.infer<typeof deleteReminderPropsSchema>;
