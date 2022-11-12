import { router } from "../router"
import * as gracely from "gracely"
import * as model from "../model"

router.add({
	listen: { methods: "POST", pattern: "/item" },
	authenticate: async request => request.header.authorization,
	body: model.Item.is,
	result: (request) => gracely.success.created(request.body),
})
