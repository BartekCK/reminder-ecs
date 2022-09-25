import { OutcomeFailure } from "./OutcomeFailure";
import { ZodError } from "zod";

interface IContext {
	originalErrorScope: string;
	originalErrorCode: string;
	originalReason: string;
	originalContext: any;
}

export class ApplicationFailure extends OutcomeFailure<IContext | ZodError> {
	private constructor(context: ZodError | IContext, errorCode?: string) {
		super({
			errorScope: "APPLICATION_ERROR",
			reason: "",
			context,
			errorCode: errorCode || "",
		});
	}

	public static invalidPayload(zodError: ZodError) {
		return new ApplicationFailure(zodError);
	}

	public static domainError(failure: OutcomeFailure) {
		const { errorScope, errorCode, context, reason } = failure.getError();

		return new ApplicationFailure({
			originalErrorScope: errorScope,
			originalErrorCode: errorCode,
			originalReason: reason,
			originalContext: context,
		});
	}

	public static infrastructureError(failure: OutcomeFailure) {
		const { errorScope, errorCode, context, reason } = failure.getError();

		return new ApplicationFailure({
			originalErrorScope: errorScope,
			originalErrorCode: errorCode,
			originalReason: reason,
			originalContext: context,
		});
	}
}
