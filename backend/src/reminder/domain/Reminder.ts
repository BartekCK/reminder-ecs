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
import {
	ReminderDeleteFailure,
	ReminderDeleteResult,
	ReminderDeleteSuccess,
} from "./behaviours/deleteResult";
import { DeleteReminderDomainEvent } from "./events/deleteReminder/DeleteReminderDomainEvent";
import { ICreateReminderDomainEventPayload } from "./events/createReminder/createReminderPayload.interface";
import { IDeleteReminderDomainEventPayload } from "./events/deleteReminder/deleteReminderPayload.interface";

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
			deletedAt: null,
		});

		for (const event of events) {
			if (event.getEventName() === CreateReminderDomainEvent.name) {
				const applyResult = CreateReminderDomainEvent.apply(
					event as DomainEvent<ICreateReminderDomainEventPayload>
				);

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
					deletedAt: null,
					note,
				});
			} else if (event.getEventName() === DeleteReminderDomainEvent.name) {
				const applyResult = DeleteReminderDomainEvent.apply(
					event as DomainEvent<IDeleteReminderDomainEventPayload>
				);

				if (applyResult.isFailure()) {
					return applyResult;
				}

				const deleteReminderEvent = applyResult.getData();

				reminder.addDomainEvent(deleteReminderEvent);
				const { deletedAt } = deleteReminderEvent.getData();
				reminder.setProps({
					...reminder.getProps(),
					deletedAt,
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
			deletedAt: null,
		});

		const eventResult = CreateReminderDomainEvent.create(
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

		if (eventResult.isFailure()) {
			return eventResult;
		}

		reminder.addDomainEvent(eventResult.getData());

		return ReminderCreateSuccess.create({
			reminder,
		});
	}

	delete(context: { traceId: string; commandName: string }): ReminderDeleteResult {
		if (this.props.deletedAt) {
			return ReminderDeleteFailure.reminderAlreadyDelete(this.getId());
		}

		const deletedAt = new Date();

		const eventResult = DeleteReminderDomainEvent.create(
			{
				deletedAt,
			},
			{
				entityId: this.getId(),
				sequence: this.getSequence(),
				traceId: context.traceId,
				commandName: context.commandName,
			}
		);

		if (eventResult.isFailure()) {
			return eventResult;
		}

		this.addDomainEvent(eventResult.getData());

		this.props.deletedAt = deletedAt;

		return ReminderDeleteSuccess.create(null);
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
