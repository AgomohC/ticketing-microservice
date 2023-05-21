import {
	Subjects,
	Listener,
	PaymentCreatedEvent,
	OderStatus,
} from "@femtoace/common"
import { queueGroupName } from "./queue-group-name"
import { Message } from "node-nats-streaming"
import { Order } from "../../models/orders"
export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
	subject: Subjects.PaymentCreated = Subjects.PaymentCreated
	queueGroupName: string = queueGroupName
	async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
		try {
			const order = await Order.findById(data.orderId)
			if (!order) {
				throw new Error("order not found")
			}
			order.set({ status: OderStatus.Complete })
			await order.save()
			msg.ack()
		} catch (error) {}
	}
}
