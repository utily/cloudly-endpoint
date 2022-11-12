import * as gracely from "gracely"
import * as http from "cloudly-http"
import { router } from "../router"
import { Environment as ContextEnvironment } from "./Environment"

export class Context {
	constructor(public readonly environment: Context.Environment) {}
	async authenticate(request: http.Request): Promise<"admin" | undefined> {
		return this.environment.adminSecret && request.header.authorization == `Basic ${this.environment.adminSecret}`
			? "admin"
			: undefined
	}
	static async handle(request: Request, environment: Context.Environment): Promise<Response> {
		let result: http.Response
		try {
			result = await router.handle(http.Request.from(request), new Context(environment))
		} catch (e) {
			const details = (typeof e == "object" && e && e.toString()) || undefined
			result = http.Response.create(gracely.server.unknown(details, "exception"))
		}
		return http.Response.to(result)
	}
	static authenticate(
		scope: "admin" | "private"
	): (request: http.Request, context: Context) => Promise<"admin" | undefined> {
		return async (request, context) => context.authenticate(request)
	}
}

export namespace Context {
	export type Environment = ContextEnvironment
}
