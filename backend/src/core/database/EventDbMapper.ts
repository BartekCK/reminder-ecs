import { IDomainEventPayload } from "../../common/events";
import { IEventDBMapper, IEventDBItem } from "../../common/database";

export class EventDBMapper implements IEventDBMapper {
  public mapDomainEventPayloadIntoEventItem(
    eventPayload: IDomainEventPayload
  ): IEventDBItem {
    return {
      id: { S: eventPayload.id },
      name: { S: eventPayload.name.toString() },
      version: { N: eventPayload.version.toString() },
      entityId: { S: eventPayload.entityId },
      sequence: { N: eventPayload.sequence.toString() },
      metadata: {
        M: {
          traceId: { S: eventPayload.metadata.traceId },
          commandName: { S: eventPayload.metadata.commandName },
          generatedAt: { S: eventPayload.metadata.generatedAt.toISOString() },
        },
      },
      data: { S: JSON.stringify(eventPayload.data) },
    };
  }
}
