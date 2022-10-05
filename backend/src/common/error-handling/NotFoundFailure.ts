import { OutcomeFailure } from "./OutcomeFailure";

export class NotFoundFailure<Context = any> extends OutcomeFailure<Context> {
	private constructor(context: Context, reason: string) {
		super({
			errorScope: "DOMAIN_ERROR",
			reason,
			context: context,
			errorCode: "ENTITY_NOT_FOUND",
		});
	}

	public static create<Context>(context: Context) {
		return new NotFoundFailure(context, "Entity not found");
	}
}
