import express, { Request, Response, NextFunction } from "express"
import { body } from "express-validator"
import { Order } from "../models/order"
import {
	requireAuth,
	validateRequest,
	BadRequestError,
	NotFoundError,
	NotAuthorizedError,
	OderStatus,
} from "@femtoace/common"
import { PaymentCreatedPublisher } from "../events/publisher/payment-created-publisher"
import { natsWrapper } from "../nats-wrapper"
const router = express.Router()

router.post(
	"/api/payments",
	requireAuth,
	[body("token").not().isEmpty(), body("orderId").not().isEmpty()],
	validateRequest,
	async (req: Request, res: Response, next: NextFunction) => {
		const { token, orderId } = req.body

		try {
			const order = await Order.findById(orderId)
			if (!order) {
				throw new NotFoundError()
			}
			if (order.userId !== req.currentUser!.id) {
				throw new NotAuthorizedError()
			}
			if (order.status === OderStatus.Cancelled) {
				throw new BadRequestError("Cannot pay for a cancelled order")
			}
			await new PaymentCreatedPublisher(natsWrapper.client).publish({
				id: order.id,
				orderId: order.id,
			})
			res.send({ success: true })
		} catch (error) {
			next(error)
		}
	}
)
export { router as createChargeRouter }
