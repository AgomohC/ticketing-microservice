import buildClient from "../../api/build-client"
import useRequest from "../../hooks/useRequest"
import { useRouter } from "next/router"

const TicketShow = ({ ticket }: any) => {
	const { push } = useRouter()
	const { doRequest, errors } = useRequest({
		url: `/api/orders`,
		method: "post",
		body: { ticketId: ticket.id },
		onSuccess: order => {
			push(`/orders/${order.id}`)
		},
	})
	return (
		<>
			<h1>{ticket.title}</h1>
			<h4>Price:{ticket.price}</h4>
			{errors}
			<button
				className='btn btn-primary'
				onClick={doRequest}
			>
				Purchase
			</button>
		</>
	)
}

TicketShow.getInitialProps = async (ctx: any) => {
	const { ticketId } = ctx.query

	const { data } = await buildClient(ctx).get(`/api/tickets/${ticketId}`)

	return { ticket: data }
}
export default TicketShow
