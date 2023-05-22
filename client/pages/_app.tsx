import "../styles/globals.css"
import type { AppProps, AppContext } from "next/app"
import "bootstrap/dist/css/bootstrap.css"
import buildClient from "../api/build-client"
import Header from "../components/Header"

type TProps = AppProps & {
	currentUser: any
}
export default function AppComponent({
	Component,
	pageProps,
	currentUser,
}: TProps) {
	return (
		<div>
			<Header currentUser={currentUser} />
			<p>{JSON.stringify(currentUser)}</p>
			<div className='container'>
				<Component
					currentUser={currentUser}
					{...pageProps}
				/>
			</div>
		</div>
	)
}
AppComponent.getInitialProps = async (appContext: AppContext) => {
	const { ctx } = appContext

	const client = buildClient(ctx)

	const { data } = await client.get("/api/users/currentuser")

	let pageProps = {}
	if (appContext.Component.getInitialProps) {
		/* @ts-ignore */
		pageProps = await appContext.Component.getInitialProps(
			appContext.ctx
			/* @ts-ignore */
			// client,
			// data.currentUser
		)
	}
	console.log(pageProps)

	return {
		pageProps,
		...data,
	}
}
