import * as gracely from "gracely"
import { Context } from "../Context"
import * as model from "../model"
import { router } from "../router"

router.add({
	listen: { methods: "POST", pattern: "/item" },
	authenticate: Context.authenticate("admin"),
	body: model.Item.is,
	result: request => gracely.success.created(request.body),
})
