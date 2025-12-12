"use client"

import { useState } from "react"
import type { Accommodation } from "@/lib/storage"

interface RoomModalProps {
  room: Accommodation
  onClose: () => void
  onConfirm: (room: Accommodation) => void
}

export default function RoomModal({ room, onClose, onConfirm }: RoomModalProps) {
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-blue-900">{room.name}</h2>
          <p className="text-sm text-gray-600">{room.type}</p>
        </div>

        {/* Details Grid */}
        <div className="space-y-4 border-y border-gray-200 py-4">
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Guests</span>
            <span className="font-bold text-blue-900">{room.capacity} maximum</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Price Per Night</span>
            <span className="font-bold text-yellow-500 text-lg">₱{room.pricePerNight}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Status</span>
            <span
              className={`font-bold px-3 py-1 rounded text-sm ${
                room.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {room.status === "active" ? "Available" : "Maintenance"}
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-bold text-gray-800 mb-2">Description</h3>
          <p className="text-sm text-gray-600">{room.description}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded font-bold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setConfirmed(true)
              onConfirm(room)
            }}
            className="flex-1 py-2 bg-yellow-400 rounded font-bold text-blue-900 hover:bg-yellow-500"
          >
            Select This Room
          </button>
        </div>
      </div>
    </div>
  )
}
