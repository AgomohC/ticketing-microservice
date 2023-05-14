export enum Subjects {
	TicketCreated = "ticket:created",
	OrderCreated = "order:created",
}
export interface TicketCreatedEvent {
	subject: Subjects.TicketCreated
	data: {
		id: string
		title: string
		price: number
	}
}
