import { useEffect, useState } from "react"
import buildClient from "../../api/build-client"
import useRequest from "../../hooks/useRequest"

const OrderShow = ({ order }: any) => {
	const [timeLeft, setTimeLeft] = useState(0)

	useEffect(() => {
		const findTimeLeft = () => {
			const msLeft = new Date(order.expiresAt) - new Date()
			setTimeLeft(Math.round(msLeft / 1000))
		}
		const timer = setInterval(findTimeLeft)

		return () => {
			clearInterval(timer)
		}
	}, [])

	const { doRequest, errors } = useRequest({
		url: "/api/payments",
		method: "post",
		body: { orderId: order.id, token: "erwesw" },
		onSuccess: () => {},
	})
	return (
		<>
			{timeLeft < 0 ? (
				<div>Order Expired</div>
			) : (
				<>
					<div>{timeLeft} seconds until order expires</div>
					<button
						className='btn btn-primary'
						onClick={doRequest}
					>
						Pay with card
					</button>
				</>
			)}
		</>
	)
}

OrderShow.getInitialProps = async (ctx: any) => {
	const { orderId } = ctx.query

	const { data } = await buildClient(ctx).get(`/api/orders/${orderId}`)
	return { order: data }
}
export default OrderShow
