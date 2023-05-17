import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import { Ticket } from "../../../models/ticket"
import { OderStatus, OrderCreatedEvent } from "@femtoace/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"

const setup = async () => {
	const listener = new OrderCreatedListener(natsWrapper.client)

	const ticket = await Ticket.create({
		title: "cjcdmk",
		price: 99,
		userId: "asdf",
	})

	const data: OrderCreatedEvent["data"] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		userId: new mongoose.Types.ObjectId().toHexString(),
		status: OderStatus.Created,
		expiresAt: new Date().toISOString(),
		ticket: {
			id: ticket.id,
			price: 20,
		},
	}
	const msg: Partial<Message> = {
		ack: jest.fn(),
	}
	return { listener, ticket, data, msg }
}
it("sets the userId of the ticket", async () => {
	const { listener, ticket, data, msg } = await setup()

	await listener.onMessage(data, msg as Message)

	const updatedTicket = await Ticket.findById(ticket.id)

	expect(updatedTicket!.orderId).toEqual(data.id)
})
it("acks the message", async () => {
	const { listener, ticket, data, msg } = await setup()
	await listener.onMessage(data, msg as Message)
	expect(msg.ack).toHaveBeenCalled()
})

it("publishes a ticket updated event", async () => {
	const { listener, data, msg } = await setup()
	await listener.onMessage(data, msg as Message)
	expect(natsWrapper.client.publish).toHaveBeenCalled()

	const ticketUpdatedData = JSON.parse(
		(natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
	)
	expect(data.id).toEqual(ticketUpdatedData.orderId)
})
