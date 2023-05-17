import { Publisher, OrderCancelledEvent, Subjects } from "@femtoace/common"

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
