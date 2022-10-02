import { v4 } from "uuid";
import { IReminder, ReminderId, ReminderProps } from "./reminder.interface";
import {
	ReminderCreateFailure,
	ReminderCreateResult,
	ReminderCreateSuccess,
} from "./behaviours/createResult";
import { AggregateRoot } from "../../common/domain";
import { CreateReminderDomainEvent } from "./events/createReminder/CreateReminderDomainEvent";
import { InvalidEventFailure } from "../../common/error-handling";
import { IReminderEventPayload } from "./events";
import { DomainEvent } from "../../common/events";
import { ReminderApplyResult, ReminderApplySuccess } from "./behaviours/applyResult";

export class Reminder extends AggregateRoot implements IReminder {
	private constructor(private props: ReminderProps) {
		super();
	}

	private setProps(props: ReminderProps) {
		this.props = props;
	}

	public static apply(events: DomainEvent<IReminderEventPayload>[]): ReminderApplyResult {
		const reminder = new Reminder({
			id: v4() as ReminderId,
			userId: "",
			note: "",
			plannedExecutionDate: undefined,
			executedAt: null,
		});

		for (const event of events) {
			if (event.getEventName() === CreateReminderDomainEvent.name) {
				const applyResult = CreateReminderDomainEvent.apply(event);

				if (applyResult.isFailure()) {
					return applyResult;
				}

				const createReminderEvent = applyResult.getData();

				reminder.addDomainEvent(createReminderEvent);
				const { note, userId, plannedExecutionDate } = createReminderEvent.getData();
				reminder.setProps({
					id: createReminderEvent.getEntityId(),
					plannedExecutionDate,
					userId,
					executedAt: null,
					note,
				});
			} else {
				return InvalidEventFailure.unknownError({
					eventName: event.getEventName(),
					eventId: event.getPayload().id,
					aggregateName: Reminder.name,
				});
			}
		}

		reminder.clearDomainEvents();
		return ReminderApplySuccess.create({ reminder });
	}

	public static create(
		data: {
			note: string;
			plannedExecutionDate?: Date;
			userId: string;
		},
		context: { traceId: string; commandName: string }
	): ReminderCreateResult {
		const { note, userId, plannedExecutionDate } = data;

		const currentTime = Date.now();

		if (plannedExecutionDate && plannedExecutionDate.getTime() <= currentTime) {
			return ReminderCreateFailure.pastExecution(
				userId,
				plannedExecutionDate,
				new Date(currentTime)
			);
		}

		if (!note.length) {
			return ReminderCreateFailure.noteIsEmpty(userId);
		}

		const reminder = new Reminder({
			id: v4() as ReminderId,
			userId,
			note,
			plannedExecutionDate,
			executedAt: null,
		});

		const event = CreateReminderDomainEvent.create(
			{
				note,
				userId,
				plannedExecutionDate,
			},
			{
				entityId: reminder.getId(),
				sequence: 0,
				traceId: context.traceId,
				commandName: context.commandName,
			}
		);

		if (event.isFailure()) {
			return event;
		}

		reminder.addDomainEvent(event.getData());

		return ReminderCreateSuccess.create({
			reminder,
		});
	}

	delete(): any {
		throw new Error("Not implemented yet");
	}

	markAsResolved(): any {
		throw new Error("Not implemented yet");
	}

	updateExecutionDate(): any {
		throw new Error("Not implemented yet");
	}

	updateNote(): any {
		throw new Error("Not implemented yet");
	}

	getProps(): ReminderProps {
		return this.props;
	}

	getId(): ReminderId {
		return this.props.id;
	}
}
