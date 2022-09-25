import { OutcomeFailure } from "./OutcomeFailure";

interface IContext {
	message: string;
}

export class InvalidEventFailure extends OutcomeFailure<IContext> {
	private constructor(context: IContext) {
		super({
			errorScope: "DOMAIN_ERROR",
			reason: "",
			context: context,
			errorCode: "INVALID_EVENT",
		});
	}

	public static create(context: { name: string; message: string }) {
		return new InvalidEventFailure(context);
	}
}
