import { DomainEvent, IDomainEventPayload } from "../events";
import { IAggregateRoot } from "./aggregateRoot.interface";

export abstract class AggregateRoot implements IAggregateRoot {
	protected sequence = 0;
	private domainEvents: DomainEvent[] = [];

	protected addDomainEvent(domainEvent: DomainEvent): void {
		this.sequence += 1;
		this.domainEvents.push(domainEvent);
	}

	public clearDomainEvents(): void {
		this.domainEvents = [];
	}

	public getChanges(): DomainEvent[] {
		return this.domainEvents;
	}
}
