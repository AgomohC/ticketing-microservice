import mongoose from "mongoose"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { OrderCancelledEvent } from "@femtoace/common"
import { Message } from "node-nats-streaming"

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client)
	const orderId = new mongoose.Types.ObjectId().toHexString()
	const ticket = new Ticket({
		title: "concert",
		price: 20,
		userId: new mongoose.Types.ObjectId().toHexString(),
	})
	ticket.set({ orderId })
	await ticket.save()

	const data: OrderCancelledEvent["data"] = {
		id: orderId,
		version: 0,
		ticket: { id: ticket.id },
	}

	const msg: Partial<Message> = {
		ack: jest.fn(),
	}

	return { msg, data, ticket, orderId, listener }
}

it("updates the ticket, publishes an event and acks a message", async () => {
	const { msg, data, ticket, orderId, listener } = await setup()
	await listener.onMessage(data, msg as Message)
	const updatedTicket = await Ticket.findById(ticket.id)
	expect(updatedTicket!.orderId).not.toBeDefined()

	expect(msg.ack).toHaveBeenCalled()
	expect(natsWrapper.client.publish).toHaveBeenCalled()
})
