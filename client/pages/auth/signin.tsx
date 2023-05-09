"use client"

import { useState } from "react"
import useRequest from "../../hooks/useRequest"
import { useRouter } from "next/router"
const signin = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const { doRequest, errors } = useRequest({
		url: "/api/users/signin",
		method: "POST",
		body: {
			email,
			password,
		},
		onSuccess: () => Router.push("/"),
	})
	const Router = useRouter()
	const submitHandler: React.FormEventHandler = async e => {
		e.preventDefault()
		await doRequest()
	}
	return (
		<form onSubmit={submitHandler}>
			<h1>Sign In</h1>
			<div className='form-group'>
				<label htmlFor=''>Email Address</label>
				<input
					type='text'
					className='form-control'
					value={email}
					onChange={e => {
						setEmail(e.target.value)
					}}
				/>
			</div>
			<div className='form-group'>
				<label htmlFor=''>Password</label>
				<input
					type='password'
					className='form-control'
					value={password}
					onChange={e => {
						setPassword(e.target.value)
					}}
				/>
			</div>

			{errors}
			<button
				className='btn btn-primary'
				type='submit'
			>
				Sign in
			</button>
		</form>
	)
}

export default signin
