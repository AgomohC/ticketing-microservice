import useRequest from "../../hooks/useRequest"
import { useEffect } from "react"
import { useRouter } from "next/router"
const signout = () => {
	const router = useRouter()
	const { doRequest } = useRequest({
		url: "/api/users/signout",
		method: "post",
		body: {},
		onSuccess: () => router.push("/"),
	})

	useEffect(() => {
		doRequest()
	}, [])
	return <div>signing you out...</div>
}

export default signout
