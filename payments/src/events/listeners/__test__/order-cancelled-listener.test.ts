import mongoose from "mongoose"
import { Order } from "../../../models/order"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { OderStatus, OrderCancelledEvent } from "@femtoace/common"
import { Message } from "node-nats-streaming"

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client)
	const order = await Order.create({
		id: new mongoose.Types.ObjectId().toHexString(),
		status: OderStatus.Created,
		price: 10,
		userId: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
	})
	const data: OrderCancelledEvent["data"] = {
		id: order.id,
		version: order.version + 1,
		ticket: { id: "6grewq" },
	}

	const msg: Partial<Message> = {
		ack: jest.fn(),
	}

	return { listener, data, msg, order }
}

it("updates the status of the order to cancelled", async () => {
	const { listener, data, msg, order } = await setup()
	await listener.onMessage(data, msg as Message)

	const updatedOrder = await Order.findById(order.id)

	expect(updatedOrder!.status).toEqual(OderStatus.Cancelled)
})

it("acks the message", async () => {
	const { listener, data, msg, order } = await setup()
	await listener.onMessage(data, msg as Message)
	expect(msg.ack).toHaveBeenCalled()
})
