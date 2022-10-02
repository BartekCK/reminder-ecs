import { IDomainEventPayload } from "./domainEvent.interface";

export class DomainEvent<T = IDomainEventPayload> {
	private readonly props: T;

	public constructor(props: T) {
		this.props = props;
	}

	public getPayload(): T {
		return this.props;
	}

	public getEventName(): string {
		return (this.props as unknown as IDomainEventPayload).name;
	}

	public getData(): T extends IDomainEventPayload ? T["data"] : any {
		return (this.props as unknown as IDomainEventPayload).data;
	}

	public getEntityId(): string {
		return (this.props as unknown as IDomainEventPayload).entityId;
	}
}
