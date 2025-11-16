import { useEffect, useState } from "react"
import EditModal from "./components/EditModal"
import Toast from "./components/Toast"
import { useToast } from "./hooks/useToast"

type Contact = {
	id: number
	name: string
	email: string
	phone: string
}

export default function App() {
	const [contacts, setContacts] = useState<Contact[]>([])
	const [search, setSearch] = useState<string>("")
	const [form, setForm] = useState({
		name: "",
		email: "",
		phone: "",
	})
	const [searchedContacts, setSearchedContacts] = useState<Contact[]>([])
	const { toast, show, message } = useToast()

	const [editing, setEditing] = useState<Contact | null>(null)
	const [isModalOpen, setModalOpen] = useState(false)

	const API_URL = "http://localhost:5000/contacts"

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	async function loadContacts() {
		const res = await fetch(API_URL)
		const data = await res.json()
		setContacts(data)
	}

	async function createContact() {
		if (!form.name || !form.email || !form.phone) return

		if (!form.email.includes("@") || !form.email.includes(".")) {
			toast("Invalid email")
			return
		}

		if (form.phone.length !== 10) {
			toast("Phone must be 10 digits")
			return
		}

		const res = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(form),
		})

		const data = await res.json()

		if (data.error) {
			toast(data.error)
			return
		}

		setForm({ name: "", email: "", phone: "" })

		toast("Contact created")
		loadContacts()
	}

	function openEdit(contact: Contact) {
		setEditing(contact)
		setModalOpen(true)
	}

	async function updateContact(id: number, data: Partial<Contact>) {
		if (
			(data.email && !data.email.includes("@")) ||
			(data.email && !data.email.includes("."))
		) {
			toast("Invalid email")
			return
		}

		if (data.phone && data.phone.length !== 10) {
			toast("Phone must be 10 digits")
			return
		}

		const res = await fetch(`${API_URL}/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
		const result = await res.json()

		if (result.error) {
			toast(result.error)
			return
		}

		toast("Contacts Updated")
		loadContacts()
	}

	useEffect(() => {
		const handler = setTimeout(async () => {
			const res = await fetch(`${API_URL}/search/${search}`)
			const data = await res.json()
			setSearchedContacts(data)
			console.log(data)
		}, 300)

		return () => clearTimeout(handler)
	}, [search])

	useEffect(() => {
		loadContacts()
	}, [])

	return (
		<div className="p-8 max-w-4xl mx-auto">
			<h1 className="text-2xl font-semibold mb-6">Contact Manager</h1>

			<div className="bg-white p-4 rounded shadow flex gap-3">
				<input
					name="name"
					placeholder="Name"
					value={form.name}
					onChange={handleChange}
					className="border px-3 py-2 rounded w-40"
				/>
				<input
					name="email"
					placeholder="Email"
					value={form.email}
					onChange={handleChange}
					className="border px-3 py-2 rounded w-56"
				/>
				<input
					name="phone"
					placeholder="Phone"
					value={form.phone}
					onChange={handleChange}
					className="border px-3 py-2 rounded w-40"
				/>
				<button
					onClick={createContact}
					className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
					Create
				</button>
			</div>
			<div className="mt-6">
				<label htmlFor="search">Search : </label>
				<input
					type="text"
					id="search"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Enter search term"
					className="p-2 border-2 rounded-md"></input>
			</div>
			<table className="w-full border mt-2 text-sm">
				<thead>
					<tr className="bg-gray-100">
						<th className="p-2 text-left">Name</th>
						<th className="p-2 text-left">Email</th>
						<th className="p-2 text-left">Phone</th>
						<th className="p-2"></th>
					</tr>
				</thead>
				<tbody>
					{search && searchedContacts
						? searchedContacts.map((c) => (
								<tr key={c.id} className="border-t">
									<td className="p-2">{c.name}</td>
									<td className="p-2">{c.email}</td>
									<td className="p-2">{c.phone}</td>
									<td className="p-2 text-right">
										<button
											onClick={() => openEdit(c)}
											className="px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-700 cursor-pointer">
											Edit
										</button>
									</td>
								</tr>
						  ))
						: contacts &&
						  contacts.map((c) => (
								<tr key={c.id} className="border-t">
									<td className="p-2">{c.name}</td>
									<td className="p-2">{c.email}</td>
									<td className="p-2">{c.phone}</td>
									<td className="p-2 text-right">
										<button
											onClick={() => openEdit(c)}
											className="px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-700 cursor-pointer">
											Edit
										</button>
									</td>
								</tr>
						  ))}
				</tbody>
			</table>

			<EditModal
				open={isModalOpen}
				contact={editing}
				onClose={() => setModalOpen(false)}
				onSave={updateContact}
			/>
			<Toast message={message} show={show} />
		</div>
	)
}
