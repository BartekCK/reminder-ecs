import { Result } from "./Result";

export type ErrorScope = "DOMAIN_ERROR" | "INFRASTRUCTURE_ERROR" | "APPLICATION_ERROR";

export type OutcomeFailureProps<T = any> = {
  errorScope: ErrorScope;
  errorCode: string;
  reason: string;
  context?: T;
};

export abstract class OutcomeFailure<T = any> extends Result {
  protected readonly errorScope: ErrorScope;
  protected readonly outcome: "FAILURE" = "FAILURE";
  protected readonly errorCode: string;
  protected readonly reason: string;
  protected readonly context?: T;

  protected constructor({
    errorScope,
    errorCode,
    reason,
    context,
  }: OutcomeFailureProps<T>) {
    super("FAILURE");
    this.errorScope = errorScope;
    this.errorCode = errorCode;
    this.reason = reason;
    this.context = context;
  }

  isFailure(): this is OutcomeFailure {
    return this.outcome === "FAILURE";
  }

  getError(): OutcomeFailureProps {
    return {
      context: this.context,
      reason: this.reason,
      errorCode: this.errorCode,
      errorScope: this.errorScope,
    };
  }
}
