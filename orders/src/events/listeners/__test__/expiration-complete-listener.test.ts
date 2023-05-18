import { natsWrapper } from "../../../nats-wrapper"
import { ExpirationCompleteEvent, OderStatus } from "@femtoace/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"
import { ExpirationCompleteListener } from "../expiration-complete-listener"
import { Order } from "../../../models/orders"

const setup = async () => {
	const listener = new ExpirationCompleteListener(natsWrapper.client)

	const ticket = new Ticket({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "concert",
		price: 20,
	})
	await ticket.save()
	const order = new Order({
		ticket,
		status: OderStatus.Created,
		userId: new mongoose.Types.ObjectId().toHexString(),
		expiresAt: new Date(),
	})
	await order.save()

	const data: ExpirationCompleteEvent["data"] = {
		orderId: order.id,
	}

	const msg: Partial<Message> = {
		ack: jest.fn(),
	}
	return { listener, data, msg, order, ticket }
}
it("updates the order status to cancelled", async () => {
	const { listener, data, msg, order } = await setup()
	await listener.onMessage(data, msg as Message)

	const updatedOrder = await Order.findById(order.id)

	expect(updatedOrder?.status).toEqual(OderStatus.Cancelled)
})
it("emits an order cancelled event", async () => {
	const { listener, data, msg, order } = await setup()
	await listener.onMessage(data, msg as Message)

	expect(natsWrapper.client.publish).toHaveBeenCalled()

	const eventData = JSON.parse(
		(natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
	)

	expect(eventData.id).toEqual(order.id)
})
it("acks the message", async () => {
	const { listener, data, msg } = await setup()
	await listener.onMessage(data, msg as Message)
	expect(msg.ack).toHaveBeenCalled()
})
