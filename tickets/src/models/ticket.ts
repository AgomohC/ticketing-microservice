import mongoose from "mongoose"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"
interface TicketAttrs {
	title: string
	price: number
	userId: string
	version: number
	orderId?: string
}
const ticketSchema = new mongoose.Schema<TicketAttrs>(
	{
		title: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		userId: {
			type: String,
			required: true,
		},
		orderId: { type: String },
	},
	{
		timestamps: true,
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id
				delete ret._id
			},
			versionKey: false,
		},
	}
)
ticketSchema.set("versionKey", "version")
ticketSchema.plugin(updateIfCurrentPlugin)
const Ticket = mongoose.model("Ticket", ticketSchema)

export { Ticket }
