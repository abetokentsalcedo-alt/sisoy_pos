"use client"

import { useState, useEffect } from "react"
import { getApiBase } from "@/lib/api"

interface Customer {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  created_at: string
}

interface ModalState {
  isOpen: boolean
  type: "success" | "error" | null
  title: string
  message: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: null,
    title: "",
    message: "",
  })

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    setLoading(true)
    const apiBase = getApiBase()
    try {
      const resp = await fetch(`${apiBase}/customers?action=list`)
      if (resp.ok) {
        const data = await resp.json()
        setCustomers(data.data || [])
      } else {
        console.error("Failed to load customers")
      }
    } catch (error) {
      console.error("Error loading customers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Strict validation
    if (!formData.first_name.trim()) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Validation Error",
        message: "First Name is required",
      })
      return
    }
    if (!formData.last_name.trim()) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Validation Error",
        message: "Last Name is required",
      })
      return
    }
    if (formData.email && !isValidEmail(formData.email)) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Validation Error",
        message: "Email must contain @ symbol (e.g., user@example.com)",
      })
      return
    }
    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Validation Error",
        message: "Phone Number must contain only numbers",
      })
      return
    }

    const apiBase = getApiBase()

    try {
      if (editingId) {
        // Update
        const resp = await fetch(`${apiBase}/customers?id=${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (resp.ok) {
          await loadCustomers()
          resetForm()
          setModal({
            isOpen: true,
            type: "success",
            title: "Success",
            message: "Customer updated successfully",
          })
        } else {
          setModal({
            isOpen: true,
            type: "error",
            title: "Error",
            message: "Failed to update customer",
          })
        }
      } else {
        // Create
        const resp = await fetch(`${apiBase}/customers?action=create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (resp.ok) {
          await loadCustomers()
          resetForm()
          setModal({
            isOpen: true,
            type: "success",
            title: "Success",
            message: "Customer created successfully",
          })
        } else {
          setModal({
            isOpen: true,
            type: "error",
            title: "Error",
            message: "Failed to create customer",
          })
        }
      }
    } catch (error) {
      console.error("Error saving customer:", error)
      setModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Error saving customer",
      })
    }
  }

  const isValidEmail = (email: string): boolean => {
    if (!email) return true // Optional field
    return email.includes('@') && email.includes('.')
  }

  const isValidPhoneNumber = (phone: string): boolean => {
    if (!phone) return true // Optional field
    return /^\d+$/.test(phone)
  }

  const handlePhoneInput = (value: string) => {
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, '')
    setFormData({ ...formData, phone: digitsOnly })
  }

  const handleDelete = async (id: number) => {
    const apiBase = getApiBase()
    try {
      const resp = await fetch(`${apiBase}/customers?id=${id}`, {
        method: "DELETE",
      })

      if (resp.ok) {
        await loadCustomers()
        setModal({
          isOpen: true,
          type: "success",
          title: "Success",
          message: "Customer deleted successfully",
        })
      } else {
        const errorData = await resp.json()
        setModal({
          isOpen: true,
          type: "error",
          title: "Error",
          message: `Failed to delete: ${errorData.error}`,
        })
      }
    } catch (error) {
      console.error("Error deleting customer:", error)
      setModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Error deleting customer",
      })
    }
  }

  const handleEdit = (customer: Customer) => {
    setFormData({
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    })
    setEditingId(customer.id)
    setShowForm(true)
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
    })
  }

  const filteredCustomers = customers.filter(
    (c) =>
      c.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  )

  if (loading && customers.length === 0) {
    return <div className="text-center py-12">Loading customers...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-(--primary-blue)">Customers</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-(--yellow) text-(--gray-dark) rounded font-bold hover:bg-yellow-400"
        >
          Add Customer
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email or phone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-(--gray-light) rounded"
      />

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white border border-(--gray-light) rounded p-6">
          <h2 className="text-xl font-bold text-(--gray-dark) mb-4">{editingId ? "Edit" : "Add"} Customer</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-(--gray-light) rounded"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-(--gray-light) rounded"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="email"
                  placeholder="Email (optional, must contain @)"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded ${
                    formData.email && !isValidEmail(formData.email)
                      ? 'border-red-500 bg-red-50'
                      : 'border-(--gray-light)'
                  }`}
                />
                {formData.email && !isValidEmail(formData.email) && (
                  <p className="text-xs text-red-600 mt-1">Email must contain @ symbol</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Phone (optional, numbers only)"
                  value={formData.phone}
                  onChange={(e) => handlePhoneInput(e.target.value)}
                  className={`w-full px-3 py-2 border rounded ${
                    formData.phone && !isValidPhoneNumber(formData.phone)
                      ? 'border-red-500 bg-red-50'
                      : 'border-(--gray-light)'
                  }`}
                />
                {formData.phone && !isValidPhoneNumber(formData.phone) && (
                  <p className="text-xs text-red-600 mt-1">Phone must contain only numbers</p>
                )}
              </div>
            </div>
            <textarea
              placeholder="Address (optional)"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-(--gray-light) rounded"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!formData.first_name.trim() || !formData.last_name.trim() || (!!formData.email && !isValidEmail(formData.email)) || (!!formData.phone && !isValidPhoneNumber(formData.phone))}
                className="px-6 py-2 bg-(--yellow) text-(--gray-dark) rounded font-bold hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-(--gray-bg) border border-(--gray-light) rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-(--gray-light) rounded overflow-x-auto">
        <table className="w-full">
          <thead className="bg-(--gray-bg) border-b border-(--gray-light)">
            <tr>
              <th className="text-left py-3 px-4 font-bold text-(--gray-dark)">Name</th>
              <th className="text-left py-3 px-4 font-bold text-(--gray-dark)">Email</th>
              <th className="text-left py-3 px-4 font-bold text-(--gray-dark)">Phone</th>
              <th className="text-left py-3 px-4 font-bold text-(--gray-dark)">Address</th>
              <th className="text-left py-3 px-4 font-bold text-(--gray-dark)">Joined</th>
              <th className="text-left py-3 px-4 font-bold text-(--gray-dark)">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="border-b border-(--gray-light) hover:bg-(--gray-bg)">
                <td className="py-3 px-4 font-medium">
                  {customer.first_name} {customer.last_name}
                </td>
                <td className="py-3 px-4 text-sm">{customer.email || "-"}</td>
                <td className="py-3 px-4 text-sm">{customer.phone || "-"}</td>
                <td className="py-3 px-4 text-sm">{customer.address || "-"}</td>
                <td className="py-3 px-4 text-sm text-(--gray-dark)">
                  {new Date(customer.created_at).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(customer)}
                    className="text-(--primary-blue) hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="text-red hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 bg-(--gray-bg) rounded">
          <p className="text-(--gray-dark)">
            {searchTerm ? "No customers match your search." : "No customers found."}
          </p>
        </div>
      )}

      {/* Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg p-6 max-w-sm w-full shadow-lg border-l-4 ${
            modal.type === "success" ? "border-green-500" : "border-red-500"
          }`}>
            <h2 className={`text-lg font-bold mb-2 ${
              modal.type === "success" ? "text-green-600" : "text-red-600"
            }`}>
              {modal.title}
            </h2>
            <p className="text-gray-700 mb-6">{modal.message}</p>
            <button
              onClick={() => setModal({ ...modal, isOpen: false })}
              className="w-full py-2 bg-(--primary-blue) text-white rounded font-bold hover:bg-blue-900 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
