import axios from "axios"
import { NextPageContext } from "next"

// @ts-ignore
export default ({ req }: NextPageContext) => {
	if (typeof window === "undefined") {
		return axios.create({
			baseURL:
				"http://ingress-nginx-controller-admission.ingress-nginx.svc.cluster.local",
			headers: req?.headers,
		})
	} else {
		return axios.create({
			baseURL: "/",
		})
	}
}
