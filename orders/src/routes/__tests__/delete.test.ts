import request from "supertest"
import app from "../../app"
import { Order } from "../../models/orders"
import { Ticket } from "../../models/ticket"
import { OderStatus } from "@femtoace/common"
import { natsWrapper } from "../../nats-wrapper"
import mongoose from "mongoose"
it("deletes an order", async () => {
	const ticket = await Ticket.create({
		title: "concert",
		price: 20,
		id: new mongoose.Types.ObjectId().toHexString(),
	})
	const user = global.signin()
	const { body: order } = await request(app)
		.post("/api/orders")
		.set("Cookie", user)
		.send({ ticketId: ticket.id })
		.expect(201)

	await request(app)
		.delete(`/api/orders/${order.id}`)
		.set("Cookie", user)
		.send()
		.expect(204)

	const updatedOrder = await Order.findById(order.id)

	expect(updatedOrder?.status).toEqual(OderStatus.Cancelled)
})
it("it emits an order cancelled event", async () => {
	const ticket = await Ticket.create({
		title: "concert",
		price: 20,
		id: new mongoose.Types.ObjectId().toHexString(),
	})
	const user = global.signin()
	const { body: order } = await request(app)
		.post("/api/orders")
		.set("Cookie", user)
		.send({ ticketId: ticket.id })
		.expect(201)

	await request(app)
		.delete(`/api/orders/${order.id}`)
		.set("Cookie", user)
		.send()
		.expect(204)

	expect(natsWrapper.client.publish).toHaveBeenCalled()
})
