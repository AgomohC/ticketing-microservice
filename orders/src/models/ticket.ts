import mongoose from "mongoose"
import { OderStatus } from "@femtoace/common"
import { Order } from "./orders"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"
export interface TicketAttrs {
	price: number
	title: string
	id?: string
	version: number
}
const TicketSchema = new mongoose.Schema<TicketAttrs>(
	{
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		title: {
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
TicketSchema.set("versionKey", "version")
TicketSchema.plugin(updateIfCurrentPlugin)
const Ticket = mongoose.model("Ticket", TicketSchema)

TicketSchema.methods.isReserved = async function () {
	const existingOrder = await Order.findOne({
		ticket: this,
		status: {
			$in: [
				OderStatus.Created,
				OderStatus.AwaitingPayment,
				OderStatus.Complete,
			],
		},
	})
	return !!existingOrder
}

export { Ticket }
