import { OutcomeSuccess, Result } from "../error-handling";
import { VError } from "verror";

export function assertSuccess(result: Result): asserts result is OutcomeSuccess {
	if (!result.isSuccess()) {
		throw new VError("result should be success", result);
	}

	expect(result.isSuccess()).toBeTruthy();
}
