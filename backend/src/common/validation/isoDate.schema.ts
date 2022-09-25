import { parseISO } from "date-fns";
import { z } from "zod";

const isAllowedDateFormat = (date: Date | string) =>
	date instanceof Date || parseISO(date).toString() !== "Invalid Date";

export const isoDateSchema = z
	.date()
	.or(z.string())
	.transform((date) => (date instanceof Date ? date : parseISO(date)))
	.refine(isAllowedDateFormat, { message: "Invalid date format" });
