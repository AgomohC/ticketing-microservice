import { requireAuth } from "@femtoace/common"
import express, { Request, Response, NextFunction } from "express"
import { Order } from "../models/orders"

const router = express.Router()

router.get(
	"/api/orders",
	async (req: Request, res: Response, next: NextFunction) => {
		console.log(req.currentUser!.id)
		try {
			const orders = await Order.find({
				userId: req.currentUser!.id,
			}).populate("ticket")
			return res.send(orders)
		} catch (error) {
			next(error)
		}
	}
)
export { router as indexOrderRouter }
