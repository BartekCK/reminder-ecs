import { IDomainEventPayload } from "../events";
import { IEventDBItem } from "./eventDbItem.interface";

export interface IEventDBMapper {
	mapDomainEventPayloadIntoEventItem: (eventPayload: IDomainEventPayload) => IEventDBItem;
}
