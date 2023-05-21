import { PaymentCreatedEvent, Subjects, Publisher } from "@femtoace/common"

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}
