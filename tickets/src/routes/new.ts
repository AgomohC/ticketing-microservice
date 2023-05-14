import express, { NextFunction, Request, Response } from "express"
import { body } from "express-validator"
import { requireAuth, validateRequest } from "@femtoace/common"
import { Ticket } from "../models/ticket"
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher"
import { natsWrapper } from "../nats-wrapper"

const router = express.Router()

router.post(
	"/api/tickets",
	requireAuth,
	[
		body("title").not().isEmpty().withMessage("Title is required"),
		body("price")
			.isFloat({
				gt: 0,
			})
			.withMessage("Price must be greater than 0"),
	],
	validateRequest,
	async (req: Request, res: Response, next: NextFunction) => {
		const { title, price } = req.body

		try {
			const ticket = await Ticket.create({
				title,
				price,
				userId: req.currentUser!.id,
			})

			new TicketCreatedPublisher(natsWrapper.client).publish({
				id: ticket._id.toString(),
				price: ticket.price,
				userId: ticket.userId,
				title: ticket.title,
			})
			return res.status(201).send(ticket)
		} catch (error) {
			next(error)
		}
	}
)
export { router as createTicketRouter }
