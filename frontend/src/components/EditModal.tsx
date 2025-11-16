import { useEffect, useState, ChangeEvent } from "react"

type Contact = {
	id: number
	name: string
	email: string
	phone: string
}

type EditModalProps = {
	open: boolean
	contact: Contact | null
	onClose: () => void
	onSave: (id: number, data: Partial<Contact>) => void
}

export default function EditModal({
	open,
	contact,
	onClose,
	onSave,
}: EditModalProps) {
	if (!open) return null

	function stop(e: MouseEvent<HTMLDivElement>) {
		e.stopPropagation()
	}
	const [form, setForm] = useState<Partial<Contact>>({})

	useEffect(() => {
		setForm(contact || {})
	}, [contact])

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	function save() {
		if (!form.id) return
		onSave(form.id, form)
		onClose()
	}

	return (
		<div
			className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50"
			onClick={onClose}>
			<div
				className="bg-white rounded shadow p-6 w-full max-w-md"
				onClick={stop}>
				<h2 className="text-lg font-semibold mb-4">Edit Contact</h2>

				<div className="space-y-3">
					<input
						name="name"
						value={form.name || ""}
						onChange={handleChange}
						className="border px-3 py-2 rounded w-full"
						placeholder="Name"
					/>

					<input
						name="email"
						value={form.email || ""}
						onChange={handleChange}
						className="border px-3 py-2 rounded w-full"
						placeholder="Email"
					/>

					<input
						name="phone"
						value={form.phone || ""}
						onChange={handleChange}
						className="border px-3 py-2 rounded w-full"
						placeholder="Phone"
					/>
				</div>

				<div className="mt-5 flex justify-end gap-3">
					<button
						onClick={onClose}
						className="px-4 py-2 border rounded text-sm bg-red-600 text-white">
						Cancel
					</button>

					<button
						onClick={save}
						className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">
						Save
					</button>
				</div>
			</div>
		</div>
	)
}
