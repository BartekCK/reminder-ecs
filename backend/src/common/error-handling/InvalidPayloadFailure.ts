import { OutcomeFailure } from "./OutcomeFailure";
import { ZodError } from "zod";

export class InvalidPayloadFailure extends OutcomeFailure<ZodError> {
	public static create(zodError: ZodError) {
		return new InvalidPayloadFailure({
			errorScope: "DOMAIN_ERROR",
			reason: "Provided data are not matching the schema",
			errorCode: "INCORRECT_COMMAND_PAYLOAD",
			context: zodError,
		});
	}
}
