import { useState } from "react"
import useRequest from "../../hooks/useRequest"
import { useRouter } from "next/router"

const NewTicket = () => {
	const [title, setTitle] = useState("")
	const [price, setPrice] = useState("")
	const { push } = useRouter()

	const { doRequest, errors } = useRequest({
		url: "/api/tickets",
		method: "post",
		body: { title, price },
		onSuccess: () => {
			push("/")
		},
	})
	const handleBlur = (e: React.FocusEvent) => {
		const value = parseFloat(price)
		if (isNaN(value)) {
			return
		}
		setPrice(value.toFixed(2))
	}

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = e => {
		e.preventDefault()
		doRequest()
	}
	return (
		<div>
			<h1>Create a Ticket</h1>
			<form onSubmit={handleSubmit}>
				<div className='form-group'>
					<label>Title</label>
					<input
						type='text'
						className='form-control'
						value={title}
						onChange={e => setTitle(e.target.value)}
					/>
				</div>
				<div className='form-group'>
					<label>Price</label>
					<input
						type='text'
						className='form-control'
						onBlur={handleBlur}
						value={price}
						onChange={e => setPrice(e.target.value)}
					/>
				</div>

				{errors}
				<button className='btn btn-primary'>Submit</button>
			</form>
		</div>
	)
}
export default NewTicket
