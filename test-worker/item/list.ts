import { Context } from "../Context"
import { router } from "../router"

router.add({
	listen: { methods: "GET", pattern: "/item" },
	authenticate: Context.authenticate("admin"),
	result: () => ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].map((id, number) => ({ id, number })),
})
