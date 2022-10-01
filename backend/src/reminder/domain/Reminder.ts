import { v4 } from "uuid";
import { IReminder, ReminderId, ReminderProps } from "./reminder.interface";
import {
	ReminderCreateFailure,
	ReminderCreateResult,
	ReminderCreateSuccess,
} from "./behaviours/createResult";
import { AggregateRoot } from "../../common/domain";
import { CreateReminderDomainEvent } from "./events/createReminder/CreateReminderDomainEvent";
import { OutcomeSuccess } from "../../common/error-handling";

export class ReminderApplySuccess extends OutcomeSuccess<{ reminder: IReminder }> {}

type ReminderApplyResult = ReminderApplySuccess;

export class Reminder extends AggregateRoot implements IReminder {
	private constructor(private readonly props: ReminderProps) {
		super();
	}

	public static apply(): ReminderApplyResult {
		//TODO: Create apply method and add domain events as arg
		const state: ReminderProps = {
			note: "",
			executedAt: null,
			userId: "",
			id: "",
		};

		return ReminderApplySuccess.create({ reminder: new Reminder(state) });
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
