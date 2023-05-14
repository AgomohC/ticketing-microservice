import supertest from "supertest"
import app from "../../app"

const createTicket = async () => {
	return supertest(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({ title: "kdmjidm", price: 20 })
}
it("can fetch a list of tickets", async () => {
	await createTicket()
	await createTicket()
	await createTicket()
	const response = await supertest(app).get("/api/tickets").send().expect(200)

	expect(response.body.length).toEqual(3)
})
