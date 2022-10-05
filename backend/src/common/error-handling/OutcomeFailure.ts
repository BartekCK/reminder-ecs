import { Result } from "./Result";

export type ErrorScope = "DOMAIN_ERROR" | "INFRASTRUCTURE_ERROR" | "APPLICATION_ERROR";

export type OutcomeFailureProps<T = any, ERROR_CODE = string> = {
	errorScope: ErrorScope;
	errorCode: ERROR_CODE;
	reason: string;
	context?: T;
};

export abstract class OutcomeFailure<T = any, ERROR_CODE = string> extends Result {
	protected readonly errorScope: ErrorScope;
	protected readonly outcome = "FAILURE" as const;
	protected readonly errorCode: ERROR_CODE;
	protected readonly reason: string;
	protected readonly context?: T;

	protected constructor({
		errorScope,
		errorCode,
		reason,
		context,
	}: OutcomeFailureProps<T, ERROR_CODE>) {
		super("FAILURE");
		this.errorScope = errorScope;
		this.errorCode = errorCode;
		this.reason = reason;
		this.context = context;
	}

	isFailure(): this is OutcomeFailure {
		return this.outcome === "FAILURE";
	}

	getError(): OutcomeFailureProps<T, ERROR_CODE> {
		return {
			context: this.context,
			reason: this.reason,
			errorCode: this.errorCode,
			errorScope: this.errorScope,
		};
	}
}
