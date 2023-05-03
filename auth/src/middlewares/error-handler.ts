import { ErrorRequestHandler } from "express"
export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
	console.log("something went wrong", error)

	return res.status(400).send({
		message: "Something went wrong",
	})
}
