import * as gracely from "gracely"
import "urlpattern-polyfill"
import * as http from "cloudly-http"
import * as cloudlyRouter from "cloudly-router"

export interface Endpoint<E extends Endpoint.Type> {
	listen: { pattern: string | URLPattern; methods: http.Method | http.Method[] }
	authenticate?: (request: http.Request) => Promise<E["authentication"] | undefined>
	body?: (body: any) => boolean
	result: (request: { authentication: E["authentication"]; body: E["body"] }) => http.Response.Like | any
}

export namespace Endpoint {
	export type Type = {
		authentication: string | boolean | Record<string, any> | undefined
		body?: any | undefined
	}
	export function toHandler<E extends Endpoint.Type, C>(
		endpoint: Endpoint<E>
	): [http.Method | http.Method[], string | URLPattern, cloudlyRouter.Handler<C>] {
		return [
			endpoint.listen.methods,
			endpoint.listen.pattern,
			async (request, context) => {
				const body = endpoint.body && (await request.body)
				let result: any | gracely.Result
				const authentication = endpoint.authenticate && (await endpoint.authenticate(request))
				if (!authentication && endpoint.authenticate)
					result = gracely.client.unauthorized()
				else if (endpoint.body != undefined && !endpoint.body(body))
					result = gracely.client.invalidContent("any", "Not specified")
				else
					result = endpoint.result({ authentication, body })
				return result
			},
		]
	}
}
