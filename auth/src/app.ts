import express, { Express } from "express"
import { currentUserRouter } from "./routes/current-user"
import { signInUserRouter } from "./routes/signin"
import { signOutUserRouter } from "./routes/signout"
import { signUpUserRouter } from "./routes/signup"
import { errorHandler } from "./middlewares/error-handler"
import { NotFoundError } from "./errors/not-found-error"
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

app.use(currentUserRouter)
app.use(signInUserRouter)
app.use(signOutUserRouter)
app.use(signUpUserRouter)

app.all("*", () => {
	throw new NotFoundError()
})
app.use(errorHandler)

export default app
