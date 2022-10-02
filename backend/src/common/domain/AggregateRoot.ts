import { DomainEvent, IDomainEventPayload } from "../events";
import { IAggregateRoot } from "./aggregateRoot.interface";

export abstract class AggregateRoot implements IAggregateRoot {
	private sequence = 0;
	private domainEvents: DomainEvent[] = [];

	protected addDomainEvent(domainEvent: DomainEvent): void {
		this.domainEvents.push(domainEvent);
		this.sequence += 1;
	}

	public clearDomainEvents(): void {
		this.domainEvents = [];
	}

	public getChanges(): DomainEvent[] {
		return this.domainEvents;
	}

	public getSequence(): number {
		return this.sequence;
	}
}
