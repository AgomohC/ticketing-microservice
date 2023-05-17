import express, { Request, Response, NextFunction } from "express"
import {
	BadRequestError,
	NotFoundError,
	OderStatus,
	requireAuth,
	validateRequest,
} from "@femtoace/common"
import { body } from "express-validator"
import mongoose from "mongoose"
import { Ticket } from "../models/ticket"
import { Order } from "../models/orders"
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher"
import { natsWrapper } from "../nats-wrapper"
const router = express.Router()
const EXPIRATION_WINDOW_sECONDS = 15 * 60
router.post(
	"/api/orders",
	requireAuth,
	[
		body("ticketId")
			.not()
			.isEmpty()
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
			.withMessage("TicketId must be provided"),
	],
	validateRequest,
	async (req: Request, res: Response, next: NextFunction) => {
		const { ticketId } = req.body
		try {
			const ticket = await Ticket.findById(ticketId)
			if (!ticket) {
				throw new NotFoundError()
			}
			const existingOrder = await Order.findOne({
				ticket,
				status: {
					$in: [
						OderStatus.Created,
						OderStatus.AwaitingPayment,
						OderStatus.Complete,
					],
				},
			})
			// const isReserved = await ticket.isReserved()
			if (existingOrder) {
				throw new BadRequestError("Ticket is already reserved")
			}
			// if (isReserved) {
			// 	throw new BadRequestError("Ticket is already reserved")
			// }

			const expiration = new Date()
			expiration.setSeconds(
				expiration.getSeconds() + EXPIRATION_WINDOW_sECONDS
			)

			const order = await Order.create({
				userId: req.currentUser!.id,
				status: OderStatus.Created,
				expiresAt: expiration,
				ticket,
			})

			new OrderCreatedPublisher(natsWrapper.client).publish({
				id: order.id,
				status: order.status,
				userId: order.userId,
				expiresAt: order.expiresAt.toISOString(),
				version: order.version,
				ticket: {
					id: ticket.id,
					price: ticket.price,
				},
			})
			return res.status(201).send(order)
		} catch (error) {
			next(error)
		}
	}
)
export { router as newOrderRouter }
