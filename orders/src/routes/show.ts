import express, { Request, Response, NextFunction } from "express"
import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
} from "@femtoace/common"
import { Order } from "../models/orders"

const router = express.Router()

router.get(
	"/api/orders/:orderId",
	requireAuth,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const order = await Order.findById(req.params.orderId).populate(
				"ticket"
			)

			if (!order) {
				throw new NotFoundError()
			}

			if (order.userId !== req.currentUser!.id) {
				throw new NotAuthorizedError()
			}
			res.send(order)
		} catch (error) {
			next(error)
		}
	}
)
export { router as showOrderRouter }
