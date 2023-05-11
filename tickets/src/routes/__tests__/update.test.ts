import supertest from "supertest"
import app from "../../app"
import mongoose from "mongoose"

it("returns a 404 if a ticket with the provided id does not exist", async () => {
	const id = new mongoose.Types.ObjectId().toHexString()

	await supertest(app)
		.put(`/api/tickets/${id}`)
		.set("Cookie", global.signin())
		.send({ title: "dkmkinr", price: 30 })
		.expect(404)
})
it("returns a 401 if the user is not authenticated", async () => {
	const id = new mongoose.Types.ObjectId().toHexString()

	await supertest(app)
		.put(`/api/tickets/${id}}`)
		.send({ title: "dkmkinr", price: 30 })
		.expect(401)
})
it("returns a 401 if the user does not own the ticket", async () => {
	const response = await supertest(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({
			title: "adkfm",
			price: 10,
		})

	await supertest(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", global.signin())
		.send({
			title: "vcxfff",
			price: 103,
		})
		.expect(401)
})
it("returns a 400 if the user provides an invalid title or price", async () => {
	const cookie = global.signin()
	const response = await supertest(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "adkfm",
			price: 10,
		})

	await supertest(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "",
			price: 103,
		})
		.expect(400)

	await supertest(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "sldjijdjd",
			price: -103,
		})
		.expect(400)
})
it("updates the ticket provided valid inputs", async () => {
	const cookie = global.signin()
	const response = await supertest(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "adkfm",
			price: 10,
		})

	await supertest(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "kkfejwrjnwd",
			price: 103,
		})
		.expect(200)
})
