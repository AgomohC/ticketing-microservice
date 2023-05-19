import { OderStatus } from "@femtoace/common"
import mongoose from "mongoose"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"

interface OrderAttrs {
	id: string
	version: number
	userId: string
	price: number
	status: OderStatus
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

		price: {
			type: Number,
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

OrderSchema.set("versionKey", "version")

OrderSchema.plugin(updateIfCurrentPlugin)

const Order = mongoose.model("Order", OrderSchema)

export { Order }
