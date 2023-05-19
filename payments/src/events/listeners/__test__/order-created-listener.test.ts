import { OderStatus, OrderCreatedEvent } from "@femtoace/common"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import { Message } from "node-nats-streaming"
import mongoose from "mongoose"
import { Order } from "../../../models/order"

const setup = async () => {
	const listener = new OrderCreatedListener(natsWrapper.client)
	const data: OrderCreatedEvent["data"] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		userId: new mongoose.Types.ObjectId().toHexString(),
		expiresAt: new Date().toISOString(),
		version: 0,
		status: OderStatus.Created,
		ticket: {
			id: new mongoose.Types.ObjectId().toHexString(),
			price: 20,
		},
	}

	const msg: Partial<Message> = { ack: jest.fn() }

	return { listener, data, msg }
}

it("replicates the order info", async () => {
	const { listener, data, msg } = await setup()
	const t = await listener.onMessage(data, msg as Message)
	const order = await Order.findById(t.id)
	expect(order!.price).toEqual(data.ticket.price)
})

it("acks the message", async () => {
	const { listener, data, msg } = await setup()
	await listener.onMessage(data, msg as Message)
	expect(msg.ack).toHaveBeenCalled()
})
