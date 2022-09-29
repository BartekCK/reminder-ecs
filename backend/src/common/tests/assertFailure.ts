import { OutcomeFailure, Result } from "../error-handling";
import { VError } from "verror";

export function assertFailure(result: Result): asserts result is OutcomeFailure {
	if (!result.isFailure()) {
		throw new VError("result should be failure", result);
	}
}
