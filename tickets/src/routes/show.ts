import express, { NextFunction, Request, Response } from "express"
import { NotFoundError } from "@femtoace/common"
import { Ticket } from "../models/ticket"

const router = express.Router()

router.get(
	"/api/tickets/:id",
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const ticket = await Ticket.findById(req.params.id)

			if (!ticket) {
				throw new NotFoundError()
			}

			res.send(ticket)
		} catch (error) {
			next(error)
		}
	}
)

export { router as showTIcketsRouter }
