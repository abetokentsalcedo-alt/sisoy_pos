"use client"

import type React from "react"

import { useState } from "react"
import { storage } from "@/lib/storage"

interface CustomerFormProps {
  selectedClientId: string
  onClientSelect: (id: string) => void
  clients: any[]
  onClientAdded: () => void
}

export default function CustomerForm({ selectedClientId, onClientSelect, clients, onClientAdded }: CustomerFormProps) {
  const [isNew, setIsNew] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
  })

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()

    // Strict validation
    if (!formData.firstName.trim()) {
      alert("First Name is required")
      return
    }
    if (!formData.lastName.trim()) {
      alert("Last Name is required")
      return
    }
    if (formData.email && !isValidEmail(formData.email)) {
      alert("Email must contain @ symbol (e.g., user@example.com)")
      return
    }
    if (formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber)) {
      alert("Phone Number must contain only numbers")
      return
    }

    const API_BASE = typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL : ''

    // Try server-first: post to customers API and use returned id when available
    if (typeof window !== 'undefined' && API_BASE) {
      try {
        const payload = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phoneNumber,
          address: formData.address || '',
        }

        const resp = await fetch(`${API_BASE}/customers?action=create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (resp.ok) {
          const json = await resp.json()
          const serverId = json && json.id ? String(json.id) : Date.now().toString()
          const newClient = {
            id: serverId,
            ...formData,
          }
          // write to localStorage manually to avoid double-posting through storage.addClient
          try {
            const existing = storage.getClients() || []
            existing.push(newClient)
            localStorage.setItem('pos_clients', JSON.stringify(existing))
          } catch {}

          onClientSelect(newClient.id)
          onClientAdded()
          setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '', address: '' })
          setIsNew(false)
          return
        }
      } catch (e) {
        // fall back to local-only if server call fails
      }
    }

    // Fallback: local-only behaviour
    const newClient = {
      id: Date.now().toString(),
      ...formData,
    }
    storage.addClient(newClient)
    onClientSelect(newClient.id)
    onClientAdded()
    setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '', address: '' })
    setIsNew(false)
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
    setFormData({ ...formData, phoneNumber: digitsOnly })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-(--gray-dark)">Customer Information</h3>

      {!isNew ? (
        <>
          <div>
            <label className="block text-sm font-medium text-(--gray-dark) mb-2">Select or Add Customer</label>
            <select
              value={selectedClientId}
              onChange={(e) => onClientSelect(e.target.value)}
              className="w-full px-3 py-2 border border-(--gray-light) rounded focus:outline-none"
            >
              <option value="">Choose customer...</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} - {c.phoneNumber}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setIsNew(true)}
            className="w-full py-2 bg-(--primary-blue) text-white rounded hover:bg-blue-900 text-sm"
          >
            Add New Customer
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
            className="w-full px-3 py-2 border border-(--gray-light) rounded text-sm"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
            className="w-full px-3 py-2 border border-(--gray-light) rounded text-sm"
          />
          <input
            type="email"
            placeholder="Email (optional, must contain @)"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-3 py-2 border rounded text-sm ${
              formData.email && !isValidEmail(formData.email) 
                ? 'border-red-500 bg-red-50' 
                : 'border-(--gray-light)'
            }`}
          />
          {formData.email && !isValidEmail(formData.email) && (
            <p className="text-xs text-red-600">Email must contain @ symbol</p>
          )}
          <input
            type="text"
            placeholder="Phone Number (optional, numbers only)"
            value={formData.phoneNumber}
            onChange={(e) => handlePhoneInput(e.target.value)}
            className={`w-full px-3 py-2 border rounded text-sm ${
              formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber)
                ? 'border-red-500 bg-red-50'
                : 'border-(--gray-light)'
            }`}
          />
          {formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber) && (
            <p className="text-xs text-red-600">Phone must contain only numbers</p>
          )}
          <input
            type="text"
            placeholder="Address (optional)"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3 py-2 border border-(--gray-light) rounded text-sm"
          />
          <button
            onClick={handleAddClient}
            disabled={!formData.firstName.trim() || !formData.lastName.trim() || (!!formData.email && !isValidEmail(formData.email)) || (!!formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber))}
            className="w-full py-2 bg-(--yellow) text-(--gray-dark) rounded font-bold text-sm hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Customer
          </button>
          <button
            onClick={() => setIsNew(false)}
            className="w-full py-2 bg-(--gray-bg) border border-(--gray-light) rounded text-sm"
          >
            Cancel
          </button>
        </>
      )}

      {selectedClientId && (
        <div className="mt-4 p-3 bg-(--gray-bg) rounded">
          <p className="text-sm font-bold text-(--primary-blue)">Customer Selected</p>
          <p className="text-sm text-(--gray-dark)">ID: {selectedClientId}</p>
        </div>
      )}
    </div>
  )
}
