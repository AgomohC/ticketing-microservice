import express, { Express } from "express"

import { errorHandler, NotFoundError, currentUser } from "@femtoace/common"
import cookieSession from "cookie-session"
const app: Express = express()
app.set("trust proxy", true)

app.use(express.json())

app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
	})
)
app.use(currentUser)

app.all("*", () => {
	throw new NotFoundError()
})
app.use(errorHandler)

export default app
