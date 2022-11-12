import * as http from "cloudly-http"
import * as cloudlyRouter from "cloudly-router"
import { Endpoint } from "./Endpoint"

export class Router<T> {
	origin: string[]
	allowedHeaders: string[]
	private readonly backend: cloudlyRouter.Router<T>
	constructor(...alternatePrefix: string[]) {
		this.backend = new cloudlyRouter.Router(...alternatePrefix)
	}
	add(method: http.Method | http.Method[], pattern: URLPattern | string, handler: cloudlyRouter.Handler<T>): void
	add<E extends Endpoint.Type>(endpoint: Endpoint<E>): void
	add<E extends Endpoint.Type>(
		method: http.Method | http.Method[] | Endpoint<E>,
		pattern?: URLPattern | string,
		handler?: cloudlyRouter.Handler<T>
	): void {
		if ((Array.isArray(method) || http.Method.is(method)) && pattern && handler)
			this.backend.add(method, pattern, handler)
		else if (typeof method == "object" && !Array.isArray(method))
			this.backend.add(...Endpoint.toHandler(method))
	}
	handle(request: http.Request.Like | http.Request, context: T): Promise<http.Response> {
		return this.backend.handle(request, context)
	}
}
