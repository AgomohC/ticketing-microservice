import {
	Listener,
	OderStatus,
	OrderCreatedEvent,
	Subjects,
} from "@femtoace/common"
import { queueGroupName } from "./queue-group-name"
import { Message } from "node-nats-streaming"
import { Order } from "../../models/order"

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated

	queueGroupName: string = queueGroupName

	async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
		const order = await Order.create({
			id: data.id,
			price: data.ticket.price,
			status: data.status,
			userId: data.userId,
			version: data.version,
		})

		// await order.save()
		msg.ack()
		return order
	}
}
