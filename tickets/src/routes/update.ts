import express, { NextFunction, Request, Response } from "express"
import { body } from "express-validator"
import {
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
	currentUser,
	requireAuth,
	validateRequest,
} from "@femtoace/common"
import { Ticket } from "../models/ticket"
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher"
import { natsWrapper } from "../nats-wrapper"
const router = express.Router()
router.put(
	"/api/tickets/:id",
	requireAuth,
	currentUser,

	[
		body("title").not().isEmpty().withMessage("TItle is required"),
		body("price")
			.isFloat({ gt: 0 })
			.withMessage("price must be provided and greater than 0"),
	],
	validateRequest,
	async (req: Request, res: Response, next: NextFunction) => {
		const {
			params: { id },
			body: { title, price },
			currentUser,
		} = req

		try {
			const ticket = await Ticket.findById(id)
			if (!ticket) {
				throw new NotFoundError()
			}
			if (ticket.orderId) {
				throw new BadRequestError("Cannot edit a reserved ticket ticket")
			}
			if (ticket.userId !== currentUser!.id) {
				throw new NotAuthorizedError()
			}

			ticket.set({
				title,
				price,
			})
			await ticket.save()

			new TicketUpdatedPublisher(natsWrapper.client).publish({
				id: ticket.id,
				title: ticket.title,
				price: ticket.price,
				userId: ticket.userId,
				version: ticket.version,
			})
			return res.send(ticket)
		} catch (error) {
			next(error)
		}
	}
)

export { router as updateTicketRouter }
