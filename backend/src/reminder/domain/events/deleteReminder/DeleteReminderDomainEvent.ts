import { DomainEvent } from "../../../../common/events";
import {
	deleteReminderDomainEventPayloadSchema,
	IDeleteReminderDomainEventPayload,
} from "./deleteReminderPayload.interface";
import { DeleteReminderDomainEventSuccess } from "./DeleteReminderDomainEventSuccess";
import { v4 } from "uuid";
import { InvalidEventFailure } from "../../../../common/error-handling";

type DeleteReminderDomainEventResult =
	| DeleteReminderDomainEventSuccess
	| InvalidEventFailure;

export class DeleteReminderDomainEvent extends DomainEvent<IDeleteReminderDomainEventPayload> {
	private constructor(props: IDeleteReminderDomainEventPayload) {
		super(props);
	}

	public static create(
		data: IDeleteReminderDomainEventPayload["data"],
		context: { entityId: string; traceId: string; sequence: number; commandName: string }
	): DeleteReminderDomainEventResult {
		const payload: IDeleteReminderDomainEventPayload = {
			id: v4(),
			name: DeleteReminderDomainEvent.name,
			data,
			entityId: context.entityId,
			metadata: {
				traceId: context.traceId,
				generatedAt: new Date(),
				commandName: context.commandName,
			},
			sequence: context.sequence + 1,
			version: 1,
		};

		const parseResult = deleteReminderDomainEventPayloadSchema.safeParse(payload);

		if (!parseResult.success) {
			return InvalidEventFailure.incorrectPayload({
				name: parseResult.error.name,
				message: parseResult.error.message,
			});
		}

		return DeleteReminderDomainEventSuccess.create(
			new DeleteReminderDomainEvent(payload)
		);
	}

	public static apply(
		event: DomainEvent<IDeleteReminderDomainEventPayload>
	): DeleteReminderDomainEventResult {
		const payload = event.getPayload();

		const parseResult = deleteReminderDomainEventPayloadSchema.safeParse(payload);

		if (!parseResult.success) {
			return InvalidEventFailure.incorrectPayload({
				name: parseResult.error.name,
				message: parseResult.error.message,
			});
		}

		return DeleteReminderDomainEventSuccess.create(
			new DeleteReminderDomainEvent(payload)
		);
	}
}
