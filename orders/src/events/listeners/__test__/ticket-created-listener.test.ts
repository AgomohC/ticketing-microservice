import { TicketCreatedListener } from "../ticket-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketCreatedEvent } from "@femtoace/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"

const setup = async () => {
	const listener = new TicketCreatedListener(natsWrapper.client)
	const data: TicketCreatedEvent["data"] = {
		version: 0,
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "concert",
		price: 10,
		userId: new mongoose.Types.ObjectId().toHexString(),
	}

	const msg: Partial<Message> = {
		ack: jest.fn(),
	}
	return { listener, data, msg }
}

it("creates and saves a ticket", async () => {
	const { listener, data, msg } = await setup()
	const { id, title, price } = data
	await listener.onMessage(data, msg as Message)

	const ticket = await Ticket.findById(id)
	expect(ticket).toBeDefined()
	expect(ticket!.title).toEqual(title)
	expect(ticket!.price).toEqual(price)
})

it("acks the message", async () => {
	const { listener, data, msg } = await setup()
	await listener.onMessage(data, msg as Message)
	expect(msg.ack).toHaveBeenCalled()
})
