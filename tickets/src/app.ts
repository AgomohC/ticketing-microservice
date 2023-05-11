import express, { Express } from "express"
import { createTicketRouter } from "./routes/new"
import { showTIcketsRouter } from "./routes/show"
import { indexTicketRouter } from "./routes"
import { updateTicketRouter } from "./routes/update"
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
app.use(createTicketRouter)
app.use(showTIcketsRouter)
app.use(updateTicketRouter)
app.use(indexTicketRouter)

app.all("*", () => {
	throw new NotFoundError()
})
app.use(errorHandler)

export default app
