import { ErrorRequestHandler } from "express"
import { CustomError } from "../errors/CustomError"
export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
	if (error instanceof CustomError) {
		return res
			.status(error.statusCode)
			.json({ errors: error.serializeErrors() })
	}
	console.error(error)
	return res.status(400).send({
		errors: [
			{
				message: "Something went wrong",
			},
		],
	})
}
