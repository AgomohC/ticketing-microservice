import { Message } from "node-nats-streaming"
import { Subjects, Listener, TicketCreatedEvent } from "@femtoace/common"
import { Ticket } from "../../models/ticket"
import { queueGroupName } from "./queue-group-name"

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
	subject: Subjects.TicketCreated = Subjects.TicketCreated
	queueGroupName: string = queueGroupName
	async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
		const { id, userId, title, price } = data

		const ticket = await Ticket.create({
			_id: id,
			title,
			price,
		})

		msg.ack()
	}
}
