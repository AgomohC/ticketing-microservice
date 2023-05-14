import supertest from "supertest"
import app from "../../app"
import { Ticket } from "../../models/ticket"
import { natsWrapper } from "../../nats-wrapper"

it("has a route handler listening to /api/tickets for post requests", async () => {
	const response = await supertest(app).post("/api/tickets").send({})

	expect(response.statusCode).not.toEqual(404)
})
it("can only be accessed by an authenticated user", async () => {
	const response = await supertest(app).post("/api/tickets").send({})

	expect(response.statusCode).toEqual(401)
})
it("return returns a status other than 401 if the user is signed in", async () => {
	const response = await supertest(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({})
	expect(response.statusCode).not.toEqual(401)
})
it("returns an error if an invalid title is provided", async () => {
	const response = await supertest(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({ title: "", price: 10 })
	expect(response.statusCode).toEqual(400)

	const responseSecond = await supertest(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({ price: 10 })
	expect(responseSecond.statusCode).toEqual(400)
})

it("returns an error if an invalid price is provided", async () => {
	const response = await supertest(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({ title: "dklkdmdkmd", price: -10 })
	expect(response.statusCode).toEqual(400)

	const responseSecond = await supertest(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({ title: "dpsmvs" })
	expect(responseSecond.statusCode).toEqual(400)
})
it("creates a ticket with valid inputs", async () => {
	let tickets = await Ticket.find({})

	expect(tickets.length).toEqual(0)
	await supertest(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({ title: "dklkdmdkmd", price: 20 })
		.expect(201)

	tickets = await Ticket.find({})
	expect(tickets.length).toEqual(1)
	expect(tickets[0].price).toEqual(20)
	expect(tickets[0].title).toEqual("dklkdmdkmd")
})
it("publishes an event", async () => {
	await supertest(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({ title: "dklkdmdkmd", price: 20 })
		.expect(201)
	expect(natsWrapper.client.publish).toHaveBeenCalled()
	console.log(natsWrapper)
})
