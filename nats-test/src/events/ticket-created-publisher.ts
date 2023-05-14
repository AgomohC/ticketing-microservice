import { Publisher } from "./base-publisher"
import { TicketCreatedEvent } from "./subjects"
import { Subjects } from "./subjects"

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	subject: Subjects.TicketCreated = Subjects.TicketCreated
}
