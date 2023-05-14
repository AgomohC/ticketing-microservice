import { Publisher, Subjects, TicketUpdatedEvent } from "@femtoace/common"

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}
