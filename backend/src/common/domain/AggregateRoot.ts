import { DomainEvent } from "../events";
import { IAggregateRoot } from "./aggregateRoot.interface";

export abstract class AggregateRoot implements IAggregateRoot {
  private domainEvents: DomainEvent[] = [];

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this.domainEvents.push(domainEvent);
  }

  public clearDomainEvents(): void {
    this.domainEvents = [];
  }

  public getChanges(): DomainEvent[] {
    return this.domainEvents;
  }
}
