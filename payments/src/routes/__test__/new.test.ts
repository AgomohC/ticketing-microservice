import supertest from "supertest"
import app from "../../app"
import { Request, Response } from "express"
import mongoose from "mongoose"
import { Order } from "../../models/order"
import { OderStatus } from "@femtoace/common"

it("returns a 404 when purchasing an order that does not exist", async () => {
	await supertest(app)
		.post("/api/payments")
		.set("Cookie", global.signin())
		.send({
			token: "njdk",
			orderId: new mongoose.Types.ObjectId().toHexString(),
		})
		.expect(404)
})
it("returns a 401 when purchasing an order that does not belongs to the user", async () => {
	const order = await Order.create({
		id: new mongoose.Types.ObjectId().toHexString(),
		userId: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		price: 0,
		status: OderStatus.Created,
	})
	await supertest(app)
		.post("/api/payments")
		.set("Cookie", global.signin())
		.send({
			token: "njdk",
			orderId: order.id,
		})
		.expect(401)
})
it("returns a 400 when purchasing a cancelled order ", async () => {
	const userId = new mongoose.Types.ObjectId().toHexString()
	const order = await Order.create({
		id: new mongoose.Types.ObjectId().toHexString(),
		userId,
		version: 0,
		price: 0,
		status: OderStatus.Cancelled,
	})

	await supertest(app)
		.post("/api/payments")
		.set("Cookie", global.signin(userId))
		.send({
			token: "njdk",
			orderId: order.id,
		})
		.expect(400)
})
