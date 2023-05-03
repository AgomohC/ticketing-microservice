import express, { Express } from "express"
import { currentUserRouter } from "./routes/current-user"
import { signInUserRouter } from "./routes/signin"
import { signOutUserRouter } from "./routes/signout"
import { signUpUserRouter } from "./routes/signup"
const app: Express = express()

app.use(express.json())

app.use(currentUserRouter)
app.use(signInUserRouter)
app.use(signOutUserRouter)
app.use(signUpUserRouter)

app.listen(3000, () => {
	console.log("Listening on port 3000!!!!!!!!!!!!!!!!!!!!!!!!!!")
})
