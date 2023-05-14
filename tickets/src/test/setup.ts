import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
declare global {
	var signin: () => string[]
}
jest.mock("../nats-wrapper")

let mongo: MongoMemoryServer
beforeAll(async () => {
	process.env.JWT_KEY = "asdf"
	mongo = await MongoMemoryServer.create()
	const mongoURI = mongo.getUri()
	await mongoose.connect(mongoURI)
})
beforeEach(async () => {
	jest.clearAllMocks()
	const collections = await mongoose.connection.db.collections()
	for (let collection of collections) {
		await collection.deleteMany()
	}
})

afterAll(async () => {
	await mongo.stop()
	await mongoose.connection.close()
})

global.signin = () => {
	const token = jwt.sign(
		{
			id: new mongoose.Types.ObjectId().toHexString(),
			email: "test@test.com",
		},
		process.env.JWT_KEY!
	)
	const session = Buffer.from(JSON.stringify({ jwt: token })).toString(
		"base64"
	)
	return [`session=${session}`]
}
