import * as isly from "isly"

export interface Item {
	id: string
	number: number
}

export namespace Item {
	export const type = isly.object(
		{
			id: isly.string,
			number: isly.number,
		},
		"Item"
	)
	export const is = type.is
	export const flaw = type.flaw
}
