import request from "supertest"
import app from "../../app"
import { Order } from "../../models/orders"
import { Ticket } from "../../models/ticket"
import mongoose from "mongoose"
import { OderStatus } from "@femtoace/common"
import { natsWrapper } from "../../nats-wrapper"
it("returns an error if the ticket does not exist", async () => {
	const ticketId = new mongoose.Types.ObjectId()
	await request(app)
		.post("/api/orders")

		.set("Cookie", global.signin())
		.send({ ticketId })
		.expect(404)
})
it("returns an error if the ticket is already reserved", async () => {
	const userId = new mongoose.Types.ObjectId()

	const ticket = await Ticket.create({
		title: "concert",
		price: 20,
		id: new mongoose.Types.ObjectId().toHexString(),
	})

	await Order.create({
		ticket,
		userId,
		status: OderStatus.Created,
		expiresAt: new Date(),
	})

	await request(app)
		.post("/api/orders")
		.set("Cookie", global.signin())
		.send({ ticketId: ticket.id })
		.expect(400)
})
it("returns a ticket", async () => {
	const ticket = await Ticket.create({
		title: "concert",
		price: 20,
		id: new mongoose.Types.ObjectId().toHexString(),
	})
	await request(app)
		.post("/api/orders")
		.set("Cookie", global.signin())
		.send({ ticketId: ticket.id })
		.expect(201)
})

it("emits an order created event", async () => {
	const ticket = await Ticket.create({
		title: "concert",
		price: 20,
		id: new mongoose.Types.ObjectId().toHexString(),
	})
	await request(app)
		.post("/api/orders")
		.set("Cookie", global.signin())
		.send({ ticketId: ticket.id })
		.expect(201)

	expect(natsWrapper.client.publish).toHaveBeenCalled()
})
