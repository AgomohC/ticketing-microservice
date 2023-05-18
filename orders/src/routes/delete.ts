import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
} from "@femtoace/common"
import express, { Request, Response, NextFunction } from "express"
import { Order } from "../models/orders"
import { OderStatus } from "@femtoace/common"
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher"
import { natsWrapper } from "../nats-wrapper"

const router = express.Router()

router.delete(
	"/api/orders/:orderId",
	requireAuth,
	async (req: Request, res: Response, next: NextFunction) => {
		const { orderId } = req.params
		try {
			const order = await Order.findById(orderId).populate("ticket")
			if (!order) {
				throw new NotFoundError()
			}

			if (order.userId !== req.currentUser!.id) {
				throw new NotAuthorizedError()
			}

			order.status = OderStatus.Cancelled

			await order.save()
			new OrderCancelledPublisher(natsWrapper.client).publish({
				id: order.id,
				version: order.version,
				ticket: {
					id: order.ticket.id as string,
				},
			})
			return res.status(204).send({})
		} catch (error) {
			next(error)
		}
	}
)
export { router as deleteOrderRouter }
