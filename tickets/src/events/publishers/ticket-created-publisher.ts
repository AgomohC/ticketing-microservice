import { Publisher, Subjects, TicketCreatedEvent } from "@femtoace/common"

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	subject: Subjects.TicketCreated = Subjects.TicketCreated
}
