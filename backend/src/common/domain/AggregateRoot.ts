import { DomainEvent } from "../events";

export abstract class AggregateRoot {
  private domainEvents: DomainEvent[] = [];

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this.domainEvents.push(domainEvent);
  }

  public clearDomainEvents(): void {
    this.domainEvents = [];
  }
}
