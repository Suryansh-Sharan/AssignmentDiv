import { useState } from "react"

export function useToast() {
	const [message, setMessage] = useState("")
	const [show, setShow] = useState(false)

	function toast(msg: string, duration = 2500) {
		setMessage(msg)
		setShow(true)

		setTimeout(() => {
			setShow(false)
		}, duration)
	}

	return { toast, show, message }
}
