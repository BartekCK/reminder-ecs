export abstract class Result {
	protected readonly outcome: "FAILURE" | "SUCCESS";

	protected constructor(outcome: "FAILURE" | "SUCCESS") {
		this.outcome = outcome;
	}

	isFailure(): boolean {
		return this.outcome === "FAILURE";
	}

	isSuccess(): boolean {
		return this.outcome === "SUCCESS";
	}
}
