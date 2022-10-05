import { OutcomeFailure } from "./OutcomeFailure";
import { ZodError } from "zod";

interface IContext {
	name: string;
	message: string;
}

export class DatabaseFailure extends OutcomeFailure<IContext | ZodError> {
	private constructor(errorCode: string, context: IContext) {
		super({
			errorScope: "INFRASTRUCTURE_ERROR",
			reason: "",
			context,
			errorCode: errorCode || "",
		});
	}

	public static create(errorCode: string, error: Error) {
		return new DatabaseFailure(errorCode, {
			name: error.name,
			message: error.message,
		});
	}
}
