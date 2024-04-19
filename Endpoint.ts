import * as gracely from "gracely"
import "urlpattern-polyfill"
import * as http from "cloudly-http"
import * as cloudlyRouter from "cloudly-router"
import * as isly from "isly"

export interface Endpoint<E extends Endpoint.Type> {
	listen: { pattern: string | URLPattern; methods: http.Method | http.Method[] }
	authenticate?: (request: http.Request, context: E["context"]) => Promise<E["authentication"] | undefined>
	body?: (body: any) => boolean
	context?: (keyof E["context"])[]
	result: (request: {
		authentication: E["authentication"]
		body: E["body"]
		context?: E["context"] // TODO: remove gracely errors
	}) => http.Response.Like | any
}

export namespace Endpoint {
	export type Type = {
		authentication: string | boolean | Record<string, any> | undefined
		body?: any | undefined
		context: any | undefined
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
				const authentication = endpoint.authenticate && (await endpoint.authenticate(request, context))
				if (!authentication && endpoint.authenticate)
					result = gracely.client.unauthorized()
				else if (endpoint.body != undefined && !endpoint.body.is(body))
					result = gracely.client.flawedContent(endpoint.body.flaw(body) as isly.Flaw)
				else
					result = endpoint.result({ authentication, body })
				return result
			},
		]
	}
}
