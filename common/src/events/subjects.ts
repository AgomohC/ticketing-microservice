export enum Subjects {
	TicketCreated = "ticket:created",
	TicketUpdated = "ticket:updated",

	OrderCreated = "order:created",
	OrderCancelled = "order:cancelled",

	ExpirationComplete = "expiration:complete",

	PaymentCreated = "payment:created",
}
export interface TicketCreatedEvent {
	subject: Subjects.TicketCreated
	data: {
		version: number
		id: string
		title: string
		price: number
		userId: string
	}
}
export interface TicketUpdatedEvent {
	subject: Subjects.TicketUpdated
	data: {
		version: number
		id: string
		title: string
		price: number
		userId: string
		orderId?: string
	}
}
