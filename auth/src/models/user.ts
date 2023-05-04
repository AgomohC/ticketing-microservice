import mongoose from "mongoose"
import { PasswordManager } from "../services/password"

// An interface that describes the properties
//  required to create a new user

interface UserAttrs {
	email: string
	password: string
}

const userSchema = new mongoose.Schema<UserAttrs>(
	{
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
)

userSchema.pre("save", async function (done) {
	if (this.isModified("password")) {
		const hashed = await PasswordManager.toHash(this.get("password"))
		this.set("password", hashed)
	}
	done()
})

const User = mongoose.model("User", userSchema)

export { User }
