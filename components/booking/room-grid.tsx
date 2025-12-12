"use client"

import { useState } from "react"
import { storage } from "@/lib/storage"
import RoomModal from "./room-modal"
import type { Accommodation } from "@/lib/storage"

interface RoomGridProps {
  checkIn: string
  checkOut: string
  selectedRoomId: string
  onRoomSelect: (id: string) => void
}

export default function RoomGrid({ checkIn, checkOut, selectedRoomId, onRoomSelect }: RoomGridProps) {
  const [selectedModal, setSelectedModal] = useState<Accommodation | null>(null)
  const accommodations = storage.getAccommodations()
  const bookings = storage.getBookings().filter((b) => b.status !== "cancelled")

  console.log("[v0] Total accommodations:", accommodations.length)
  console.log("[v0] All accommodations:", accommodations)

  const rooms = accommodations
    .filter((a) => a.type === "Room")
    .sort((a, b) => {
      const numA = Number.parseInt((a.name.split(" ")[1] ?? "0")) || 0
      const numB = Number.parseInt((b.name.split(" ")[1] ?? "0")) || 0
      return numA - numB
    })

  const cottagesRegular = accommodations
    .filter((a) => a.type === "Cottage" && a.capacity <= 5)
      .sort((a, b) => {
      const numA = Number.parseInt((a.name.split(" ").pop() ?? "0")) || 0
      const numB = Number.parseInt((b.name.split(" ").pop() ?? "0")) || 0
      return numA - numB
    })

  const cottagesLarge = accommodations
    .filter((a) => a.type === "Cottage" && a.capacity > 5)
      .sort((a, b) => {
      const numA = Number.parseInt((a.name.split(" ").pop() ?? "0")) || 0
      const numB = Number.parseInt((b.name.split(" ").pop() ?? "0")) || 0
      return numA - numB
    })

  const villas = accommodations
    .filter((a) => a.type === "Villa")
    .sort((a, b) => {
      const numA = Number.parseInt((a.name.split(" ")[1] ?? "0")) || 0
      const numB = Number.parseInt((b.name.split(" ")[1] ?? "0")) || 0
      return numA - numB
    })

  console.log("[v0] Rooms:", rooms.length, rooms)
  console.log("[v0] Cottages Regular:", cottagesRegular.length, cottagesRegular)
  console.log("[v0] Cottages Large:", cottagesLarge.length, cottagesLarge)
  console.log("[v0] Villas:", villas.length, villas)

  const getAvailabilityStatus = (roomId: string): "available" | "booked" | "maintenance" => {
    const room = accommodations.find((a) => a.id === roomId)
    if (room?.status === "maintenance") return "maintenance"

    if (!checkIn || !checkOut) return "available"

    const from = new Date(checkIn)
    const to = new Date(checkOut)

    const isBooked = bookings.some((b) => {
      if (b.accommodationId !== roomId) return false
      const bFrom = new Date(b.dateFrom)
      const bTo = new Date(b.dateTo)
      return !(to <= bFrom || from >= bTo)
    })

    return isBooked ? "booked" : "available"
  }

  const RoomCard = ({ room }: { room: Accommodation }) => {
    const status = getAvailabilityStatus(room.id)
    const isSelected = selectedRoomId === room.id

    const statusColors = {
      available: "bg-white border-2 border-gray-300 hover:border-blue-500 hover:shadow-md",
      booked: "bg-green-500 border-2 border-green-600 text-white",
      maintenance: "bg-gray-400 border-2 border-gray-500 opacity-70 cursor-not-allowed",
    }

    return (
      <button
        onClick={() => {
          if (status !== "maintenance") {
            setSelectedModal(room)
            if (status === "available") {
              onRoomSelect(room.id)
            }
          }
        }}
        disabled={status === "maintenance"}
        className={`p-3 rounded-lg transition-all transform hover:scale-105 ${statusColors[status]} ${
          isSelected ? "ring-4 ring-yellow-400 ring-offset-2" : ""
        }`}
      >
        <div className="text-left">
          <h4 className={`text-xl font-bold ${status === "booked" ? "text-white" : "text-blue-900"}`}>{room.name}</h4>
          <p className={`text-xs ${status === "booked" ? "text-white" : "text-gray-600"}`}>{room.type}</p>
          <div className={`mt-2 flex items-center justify-between text-sm ${status === "booked" ? "text-white" : ""}`}>
            <span className={`font-bold ${status === "booked" ? "text-white" : "text-blue-600"}`}>
              ₱{room.pricePerNight}
            </span>
            <span
              className={`text-xs font-bold px-2 py-1 rounded ${
                status === "available"
                  ? "bg-gray-100 text-green-600 border border-green-400"
                  : status === "booked"
                    ? "bg-white text-green-600 font-bold"
                    : "bg-gray-600 text-white"
              }`}
            >
              {status === "available" ? "FREE" : status === "booked" ? "✓ BOOKED" : "MAINTENANCE"}
            </span>
          </div>
          <p className={`text-xs mt-1 ${status === "booked" ? "text-white" : "text-gray-600"}`}>
            {room.capacity} guests
          </p>
        </div>
      </button>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-blue-900">Room & Accommodation Availability</h2>

      {/* Rooms Section */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-blue-900 text-white px-3 py-1 rounded text-sm font-bold">STANDARD ROOMS</span>
          <span className="text-sm text-gray-600">({rooms.length})</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>

      {/* Cottages Regular Section */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-blue-900 text-white px-3 py-1 rounded text-sm font-bold">COTTAGES (1-5 PAX)</span>
          <span className="text-sm text-gray-600">({cottagesRegular.length})</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {cottagesRegular.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>

      {/* Cottages Large Section */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-blue-900 text-white px-3 py-1 rounded text-sm font-bold">COTTAGES (15+ PAX)</span>
          <span className="text-sm text-gray-600">({cottagesLarge.length})</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {cottagesLarge.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>

      {/* Villas Section */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-blue-900 text-white px-3 py-1 rounded text-sm font-bold">VILLAS</span>
          <span className="text-sm text-gray-600">({villas.length})</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {villas.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>

      {/* Room Details Modal */}
      {selectedModal && (
        <RoomModal
          room={selectedModal}
          onClose={() => setSelectedModal(null)}
          onConfirm={(room) => {
            onRoomSelect(room.id)
            setSelectedModal(null)
          }}
        />
      )}
    </div>
  )
}
