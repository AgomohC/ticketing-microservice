import { Subjects } from "./subjects"
import { OderStatus } from "./types/order-status"

export interface OrderCancelledEvent {
	subject: Subjects.OrderCancelled
	data: {
		id: string
		version: number
		ticket: {
			id: string
		}
	}
}
