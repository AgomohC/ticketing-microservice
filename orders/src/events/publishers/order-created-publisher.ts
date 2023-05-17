import { Publisher, OrderCreatedEvent, Subjects } from "@femtoace/common"

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated
}
