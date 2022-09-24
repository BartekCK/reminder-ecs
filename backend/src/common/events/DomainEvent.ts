import { IDomainEvent } from "./domainEvent.interface";

export abstract class DomainEvent<T extends IDomainEvent> {
  private readonly props: T;
  protected constructor(props: T) {
    this.props = props;
  }
}
