import { IDomainEventPayload } from "./domainEvent.interface";

export abstract class DomainEvent<T = IDomainEventPayload> {
  private readonly props: T;

  protected constructor(props: T) {
    this.props = props;
  }
}
