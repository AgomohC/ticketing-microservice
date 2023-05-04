import express, { Express } from "express"
import { currentUserRouter } from "./routes/current-user"
import { signInUserRouter } from "./routes/signin"
import { signOutUserRouter } from "./routes/signout"
import { signUpUserRouter } from "./routes/signup"
import { errorHandler } from "./middlewares/error-handler"
import { NotFoundError } from "./errors/not-found-error"
import mongoose from "mongoose"
import cookieSession from "cookie-session"

const app: Express = express()
app.set("trust proxy", true)

app.use(express.json())

app.use(
	cookieSession({
		signed: false,
		secure: true,
		// httpOnly:true
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

const start = async () => {
	try {
		await mongoose.connect("mongodb://auth-mongo-srv:27017/auth")
	} catch (error) {
		console.error(error)
	}
	app.listen(3000, () => {
		console.log("Listening on port 3000!!!!!!!!!!!!!!!!!!!!!!!!!!")
	})
}
start()
