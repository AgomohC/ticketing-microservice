import {
	Listener,
	Subjects,
	ExpirationCompleteEvent,
	OderStatus,
} from "@femtoace/common"
import { queueGroupName } from "./queue-group-name"
import { Message } from "node-nats-streaming"
import { Order } from "../../models/orders"
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher"
import { natsWrapper } from "../../nats-wrapper"

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
	subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
	queueGroupName = queueGroupName
	async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
		const order = await Order.findById(data.orderId).populate("ticket")

		if (!order) {
			throw new Error(" Order not found")
		}
		if (order.status === OderStatus.Complete) {
			return msg.ack()
		}
		order.set({ status: OderStatus.Cancelled })
		await order.save()

		await new OrderCancelledPublisher(this.client).publish({
			id: order.id,
			version: order.version,
			ticket: { id: order.ticket.id as string },
		})

		msg.ack()
	}
}
