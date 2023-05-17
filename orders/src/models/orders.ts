import mongoose from "mongoose"
import { OderStatus } from "@femtoace/common"
import { type TicketAttrs as TicketDoc } from "./ticket"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"

interface OrderAttrs {
	ticket: TicketDoc
	userId: string
	status: OderStatus
	expiresAt: Date
	version: number
}
const OrderSchema = new mongoose.Schema<OrderAttrs>(
	{
		userId: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: Object.values(OderStatus),
			default: OderStatus.Created,
		},

		expiresAt: {
			type: mongoose.Schema.Types.Date,
		},
		ticket: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Ticket",
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

OrderSchema.set("versionKey", "version")

OrderSchema.plugin(updateIfCurrentPlugin)

const Order = mongoose.model("Order", OrderSchema)

export { Order }
