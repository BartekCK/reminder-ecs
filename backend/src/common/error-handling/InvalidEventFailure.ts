import { OutcomeFailure } from "./OutcomeFailure";

interface IContext {
	message?: string;
	eventName?: string;
	eventId?: string;
	aggregateName?: string;
}

export class InvalidEventFailure extends OutcomeFailure<IContext> {
	private constructor(context: IContext, reason: string) {
		super({
			errorScope: "DOMAIN_ERROR",
			reason,
			context: context,
			errorCode: "INVALID_EVENT",
		});
	}

	public static incorrectPayload(context: { name: string; message: string }) {
		return new InvalidEventFailure(context, "Provided payload not matching the schema");
	}

	public static unknownError(context: Omit<IContext, "message">) {
		return new InvalidEventFailure(context, "Unknown error occurred during applying");
	}
}
