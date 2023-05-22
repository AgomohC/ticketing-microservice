import { Request, Response, NextFunction } from "express"
import { NotAuthorizedError } from "../errors/not-authorized-error"

export function requireAuth(req: Request, res: Response, next: NextFunction) {
	try {
		if (!req.currentUser) {
			throw new NotAuthorizedError()
		}
		next()
	} catch (error) {
		next(error)
	}
}
