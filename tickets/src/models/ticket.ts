import mongoose from "mongoose"

interface TicketAttrs {
	title: string
	price: number
	userId: string
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

const Ticket = mongoose.model("Ticket", ticketSchema)

export { Ticket }
