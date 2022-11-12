import { router } from "../router"

router.add({
	listen: { methods: "GET", pattern: "/item" },
	authenticate: async request => request.header.authorization,
	result: () => ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].map((id, number) => ({ id, number })),
})
