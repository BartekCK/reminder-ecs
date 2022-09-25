import { DomainEvent } from "../events";

export interface IAggregateRoot {
  clearDomainEvents: () => void;
  getChanges: () => DomainEvent[];
}
