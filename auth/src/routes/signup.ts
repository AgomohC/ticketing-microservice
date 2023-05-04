import express, { Response, Request, NextFunction } from "express"
import { body, validationResult } from "express-validator"
import { RequestValidationError } from "../errors/Request-validation-error"
import { BadRequestError } from "../errors/bad-request-error"
import { User } from "../models/user"
import Jwt from "jsonwebtoken"
const router = express.Router()

router.post(
	"/api/users/signup",
	[
		body("email").isEmail().withMessage("Email must be valid"),
		body("password")
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage("Password must be between 4 and 20 characters"),
	],
	async (req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			throw new RequestValidationError(errors.array())
		}

		const { email, password } = req.body

		try {
			const existingUser = await User.findOne({ email })
			if (existingUser) {
				throw new BadRequestError("Email in use")
			}

			const new_user = await User.create({
				email,
				password,
			})

			// Generate jwt

			const userJwt = Jwt.sign(
				{
					id: new_user.id,
					email: new_user.email,
				},
				"asdf"
			)

			req.session = { jwt: userJwt }
			res.status(201).send(new_user)
		} catch (error) {
			next(error)
		}
	}
)

export { router as signUpUserRouter }
