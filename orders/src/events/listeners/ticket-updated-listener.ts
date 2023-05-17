import { Message } from "node-nats-streaming"
import { Subjects, Listener, TicketUpdatedEvent } from "@femtoace/common"
import { Ticket } from "../../models/ticket"
import { queueGroupName } from "./queue-group-name"

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
	subject: Subjects.TicketUpdated = Subjects.TicketUpdated
	queueGroupName: string = queueGroupName
	async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
		const { id, userId, title, price, version } = data

		const ticket = await Ticket.findOne({
			_id: id,
			version: version == 0 ? 0 : version - 1,
		})

		if (!ticket) {
			throw new Error("Ticket not found")
		}

		ticket.set({ title, price })
		await ticket.save()

		msg.ack()
	}
}
