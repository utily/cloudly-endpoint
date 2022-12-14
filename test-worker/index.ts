import { Context } from "./Context"

import "./item"
import "./version"

export default {
	async fetch(request: Request, environment: Context.Environment) {
		return await Context.handle(request, environment)
	},
}
