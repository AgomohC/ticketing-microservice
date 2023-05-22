import { Subjects } from "./subjects"
import { OderStatus } from "./types/order-status"

export interface OrderCreatedEvent {
	subject: Subjects.OrderCreated
	data: {
		id: string
		status: OderStatus
		userId: string
		expiresAt: string
		version: number
		ticket: {
			id: string
			price: number
		}
	}
}
