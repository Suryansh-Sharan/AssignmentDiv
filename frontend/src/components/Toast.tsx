type ToastProps = {
	message: string
	show: boolean
}

export default function Toast({ message, show }: ToastProps) {
	if (!show) return null

	return (
		<div className="fixed animate-bounce bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded shadow z-50 text-sm">
			{message}
		</div>
	)
}
