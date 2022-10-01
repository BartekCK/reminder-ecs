import { DomainEvent } from "../events";
import { IEventDBItem } from "./eventDbItem.interface";

export interface IEventDBMapper {
	mapDomainEventIntoEventItem: (eventPayload: DomainEvent) => IEventDBItem;
	mapEventItemIntoDomainEvent: (dbItem: IEventDBItem) => DomainEvent;
}
