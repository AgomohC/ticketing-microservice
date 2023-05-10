import express, { Response, Request } from "express"
import { currentUser } from "@femtoace/common"

const router = express.Router()

router.get(
	"/api/users/currentuser",
	currentUser,
	(req: Request, res: Response) => {
		try {
			return res.send({ currentUser: req.currentUser })
		} catch (error) {
			return res.send({ currentUser: null })
		}
	}
)

export { router as currentUserRouter }
