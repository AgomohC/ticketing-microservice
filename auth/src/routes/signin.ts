import express, { Response, Request, NextFunction } from "express"
import { body } from "express-validator"
import { User } from "../models/user"
import { validateRequest } from "../middlewares/validate-requests"
import { BadRequestError } from "../errors/bad-request-error"
import { PasswordManager } from "../services/password"
import Jwt from "jsonwebtoken"
const router = express.Router()

router.post(
	"/api/users/signin",
	[
		body("email").isEmail().withMessage("Email must be valid"),
		body("password")
			.trim()
			.notEmpty()
			.withMessage("Please provide a password"),
	],
	validateRequest,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email, password } = req.body

			const existingUser = await User.findOne({ email })
			if (!existingUser) {
				throw new BadRequestError("Invalid Credentials")
			}
			const passwordsMatch = await PasswordManager.compare(
				existingUser.password,
				password
			)
			if (passwordsMatch) {
				throw new BadRequestError("Invalid Credentials")
			}

			const userJwt = Jwt.sign(
				{
					id: existingUser.id,
					email: existingUser.email,
				},
				process.env.JWT_KEY!
			)

			req.session = { jwt: userJwt }
			res.status(200).send(existingUser)
		} catch (error) {
			next(error)
		}
	}
)

export { router as signInUserRouter }
