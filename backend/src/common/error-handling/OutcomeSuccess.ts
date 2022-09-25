import { Result } from "./Result";

export abstract class OutcomeSuccess<T = any> extends Result {
	private readonly data: T;

	protected constructor(data: T) {
		super("SUCCESS");

		this.data = data;
	}

	getData(): T {
		return this.data;
	}

	isSuccess(): this is OutcomeSuccess<T> {
		return this.outcome === "SUCCESS";
	}

	public static create<T>(data: T): OutcomeSuccess<T> {
		return new (class extends OutcomeSuccess<T> {})(data);
	}
}
