import mongoose from "mongoose"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedListener } from "../ticket-updated-listener"
import { TicketUpdatedEvent } from "@femtoace/common"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"

const setup = async () => {
	const listener = new TicketUpdatedListener(natsWrapper.client)
	const ticket = new Ticket({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "concert",
		price: 20,
	})

	await ticket.save()

	const data: TicketUpdatedEvent["data"] = {
		version: 0,
		id: ticket.id,
		title: "concert",
		price: 10,
		userId: new mongoose.Types.ObjectId().toHexString(),
	}

	const msg: Partial<Message> = {
		ack: jest.fn(),
	}
	return { listener, data, msg, ticket }
}

it("finds, updates and saves a ticket", async () => {
	const { listener, data, msg, ticket } = await setup()

	await listener.onMessage(data, msg as Message)

	const updatedTicket = await Ticket.findById(ticket.id)

	expect(updatedTicket!.title).toEqual(data.title)
	expect(updatedTicket!.price).toEqual(data.price)
	expect(updatedTicket!.version).toEqual(data.version + 1)
})

it("acks the message", async () => {
	const { listener, data, msg } = await setup()
	await listener.onMessage(data, msg as Message)
	expect(msg.ack).toHaveBeenCalled()
})
it("does not acks the message if the event skipped a version number", async () => {
	const { listener, data, msg, ticket } = await setup()

	data.version = 12
	try {
		await listener.onMessage(data, msg as Message)
	} catch (error) {}
	expect(msg.ack).not.toHaveBeenCalled()
})
