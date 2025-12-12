"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { storage, type Accommodation } from "@/lib/storage"
import { getApiBase } from "@/lib/api"

interface ModalState {
  isOpen: boolean
  type: "success" | "error" | null
  title: string
  message: string
}

export default function AccommodationsPage() {
  const [accommodations, setAccommodations] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "Room",
    description: "",
    capacity: 2,
    price_per_night: 100,
    status: "active",
  })
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: null,
    title: "",
    message: "",
  })

  useEffect(() => {
    loadAccommodations()
  }, [])

  const loadAccommodations = async () => {
    setLoading(true)
    const apiBase = getApiBase()
    try {
      const resp = await fetch(`${apiBase}/accommodations?action=list`)
      if (resp.ok) {
        const data = await resp.json()
        setAccommodations(data.data || [])
      } else {
        // Fallback to local storage
        const localAccs = storage.getAccommodations()
        setAccommodations(localAccs.map((a) => ({
          id: parseInt(a.id),
          name: a.name,
          type: a.type,
          description: a.description,
          capacity: a.capacity,
          price_per_night: a.pricePerNight,
          status: a.status,
        })))
      }
    } catch (error) {
      console.error("Error loading accommodations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const apiBase = getApiBase()
    
    try {
      if (editingId) {
        // Update
        const resp = await fetch(`${apiBase}/accommodations?id=${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (resp.ok) {
          await loadAccommodations()
          resetForm()
          setModal({
            isOpen: true,
            type: "success",
            title: "Success",
            message: "Accommodation updated successfully",
          })
        } else {
          setModal({
            isOpen: true,
            type: "error",
            title: "Error",
            message: "Failed to update accommodation",
          })
        }
      } else {
        // Create
        const resp = await fetch(`${apiBase}/accommodations?action=create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (resp.ok) {
          await loadAccommodations()
          resetForm()
          setModal({
            isOpen: true,
            type: "success",
            title: "Success",
            message: "Accommodation created successfully",
          })
        } else {
          setModal({
            isOpen: true,
            type: "error",
            title: "Error",
            message: "Failed to create accommodation",
          })
        }
      }
    } catch (error) {
      console.error("Error saving accommodation:", error)
      setModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Error saving accommodation",
      })
    }
  }

  const handleDelete = async (id: number) => {
    const apiBase = getApiBase()
    try {
      const resp = await fetch(`${apiBase}/accommodations?id=${id}`, {
        method: "DELETE",
      })
      
      if (resp.ok) {
        await loadAccommodations()
        setModal({
          isOpen: true,
          type: "success",
          title: "Success",
          message: "Accommodation deleted successfully",
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
      console.error("Error deleting accommodation:", error)
      setModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Error deleting accommodation",
      })
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      name: "",
      type: "Room",
      description: "",
      capacity: 2,
      price_per_night: 100,
      status: "active",
    })
  }

  const handleEdit = (acc: any) => {
    setFormData({
      name: acc.name,
      type: acc.type,
      description: acc.description,
      capacity: acc.capacity,
      price_per_night: acc.price_per_night,
      status: acc.status,
    })
    setEditingId(acc.id)
    setShowForm(true)
  }

  if (loading && accommodations.length === 0) {
    return <div className="text-center py-12">Loading accommodations...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-(--primary-blue)">Accommodations</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-(--yellow) text-(--gray-dark) rounded font-bold hover:bg-yellow-400"
        >
          Add Accommodation
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white border border-(--gray-light) rounded p-6">
          <h2 className="text-xl font-bold text-(--gray-dark) mb-4">{editingId ? "Edit" : "Add"} Accommodation</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="px-3 py-2 border border-(--gray-light) rounded"
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="px-3 py-2 border border-(--gray-light) rounded"
              >
                <option value="Villa">Villa</option>
                <option value="Cottage">Cottage</option>
                <option value="Room">Room</option>
              </select>
            </div>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-(--gray-light) rounded"
              rows={3}
            />
            <div className="grid grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Capacity"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="px-3 py-2 border border-(--gray-light) rounded"
              />
              <input
                type="number"
                placeholder="Price per night"
                value={formData.price_per_night}
                onChange={(e) => setFormData({ ...formData, price_per_night: parseFloat(e.target.value) })}
                className="px-3 py-2 border border-(--gray-light) rounded"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="px-3 py-2 border border-(--gray-light) rounded"
              >
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-(--yellow) text-(--gray-dark) rounded font-bold hover:bg-yellow-400"
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

      {/* Grid View */}
      <div className="grid grid-cols-3 gap-6">
        {accommodations.map((acc) => (
          <div key={acc.id} className="bg-white border border-(--gray-light) rounded p-6">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-(--gray-dark)">{acc.name}</h3>
              <p className="text-sm text-(--gray-dark)">{acc.type}</p>
            </div>
            <p className="text-sm text-(--gray-dark) mb-4 line-clamp-2">{acc.description}</p>
            <div className="space-y-1 text-sm mb-4 border-t border-(--gray-light) pt-4">
              <p>
                <strong>Capacity:</strong> {acc.capacity} guests
              </p>
              <p>
                <strong>Price:</strong> ₱{parseFloat(acc.price_per_night).toLocaleString()}/night
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={acc.status === "active" ? "text-green" : "text-red"}>{acc.status}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(acc)}
                className="flex-1 py-2 bg-(--primary-blue) text-white rounded font-bold hover:bg-blue-900"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(acc.id)}
                className="flex-1 py-2 bg-red text-white rounded font-bold hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {accommodations.length === 0 && (
        <div className="text-center py-12 bg-(--gray-bg) rounded">
          <p className="text-(--gray-dark)">No accommodations found.</p>
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
