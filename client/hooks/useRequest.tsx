import axios from "axios"
import { useState } from "react"

const useRequest = ({
	url,
	method,
	body,
	onSuccess,
}: {
	url: string
	method: string
	body: any
	onSuccess: () => void
}) => {
	const [errors, setErrors] = useState<any>()

	const doRequest = async () => {
		try {
			setErrors(undefined)
			const response = await axios({ method, url, data: body })
			onSuccess()
			return response.data
		} catch (err: any) {
			setErrors(
				<div className='alert alert-danger'>
					<h4>Ooops...</h4>
					<ul className='my-0'>
						{err.response?.data.errors.map((err: any) => (
							<li key={err.message}>{err.message}</li>
						))}
					</ul>
				</div>
			)
		}
	}
	return { doRequest, errors }
}

export default useRequest
