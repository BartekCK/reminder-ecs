import { DomainEvent } from "../../../../common/events";
import {
	createReminderDomainEventPayloadSchema,
	ICreateReminderDomainEventPayload,
} from "./createReminderPayload.interface";
import { CreateReminderDomainEventSuccess } from "./CreateReminderDomainEventSuccess";
import { v4 } from "uuid";
import { InvalidEventFailure } from "../../../../common/error-handling";

type CreateReminderDomainEventResult =
	| CreateReminderDomainEventSuccess
	| InvalidEventFailure;

export class CreateReminderDomainEvent extends DomainEvent<ICreateReminderDomainEventPayload> {
	private constructor(props: ICreateReminderDomainEventPayload) {
		super(props);
	}

	public static create(
		data: ICreateReminderDomainEventPayload["data"],
		context: { entityId: string; traceId: string; sequence: number; commandName: string }
	): CreateReminderDomainEventResult {
		const payload: ICreateReminderDomainEventPayload = {
			id: v4(),
			name: CreateReminderDomainEvent.name,
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

		const parseResult = createReminderDomainEventPayloadSchema.safeParse(payload);

		if (!parseResult.success) {
			return InvalidEventFailure.incorrectPayload({
				name: parseResult.error.name,
				message: parseResult.error.message,
			});
		}

		return CreateReminderDomainEventSuccess.create(
			new CreateReminderDomainEvent(payload)
		);
	}

	public static apply(
		event: DomainEvent<ICreateReminderDomainEventPayload>
	): CreateReminderDomainEventResult {
		const payload = event.getPayload();

		const parseResult = createReminderDomainEventPayloadSchema.safeParse(payload);

		if (!parseResult.success) {
			return InvalidEventFailure.incorrectPayload({
				name: parseResult.error.name,
				message: parseResult.error.message,
			});
		}

		return CreateReminderDomainEventSuccess.create(
			new CreateReminderDomainEvent(payload)
		);
	}
}
