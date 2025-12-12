"use client"

import { useState, useEffect } from "react"
import type { Client } from "@/lib/storage"
import { useRouter } from "next/navigation"
import { storage } from "@/lib/storage"
import CustomerForm from "@/components/booking/customer-form"
import RoomGrid from "@/components/booking/room-grid"
import BillingPanel from "@/components/booking/billing-panel"

interface ModalState {
  isOpen: boolean
  type: "success" | "error" | "confirm" | null
  title: string
  message: string
  action?: () => void
}

export default function NewBookingPage() {
  const router = useRouter()
  const [selectedClient, setSelectedClient] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [selectedRoom, setSelectedRoom] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: null,
    title: "",
    message: "",
  })

  useEffect(() => {
    setClients(storage.getClients())
  }, [])

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0
    const from = new Date(checkIn)
    const to = new Date(checkOut)
    return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getSelectedRoomData = () => {
    return storage.getAccommodations().find((a) => a.id === selectedRoom)
  }

  const totalAmount = () => {
    const room = getSelectedRoomData()
    if (!room) return 0
    return room.pricePerNight * calculateNights()
  }

  const handleProceedToPayment = () => {
    if (!selectedClient || !checkIn || !checkOut || !selectedRoom) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Incomplete Form",
        message: "Please fill all fields and select a room",
      })
      return
    }

    const booking = {
      id: Date.now().toString(),
      clientId: selectedClient,
      accommodationId: selectedRoom,
      dateFrom: checkIn,
      dateTo: checkOut,
      status: "pending" as const,
      totalAmount: totalAmount(),
      createdAt: new Date().toISOString(),
      paymentStatus: "unpaid" as const,
    }

    // Show confirmation modal
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Confirm Booking",
      message: `Proceed to payment for ${calculateNights()} nights (₱${totalAmount().toLocaleString()})?`,
      action: () => {
        sessionStorage.setItem("tempBooking", JSON.stringify(booking))
        setModal({ ...modal, isOpen: false })
        router.push(`/booking/payment?bookingId=${booking.id}&amount=${booking.totalAmount}`)
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900">New Booking</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Customer Panel - Sticky on desktop, normal flow on mobile */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 lg:sticky lg:top-6 lg:h-fit">
            <CustomerForm
              selectedClientId={selectedClient}
              onClientSelect={setSelectedClient}
              clients={storage.getClients()}
              onClientAdded={() => setClients(storage.getClients())}
            />
          </div>
        </div>

        {/* Room Grid and Billing on Right */}
        <div className="lg:col-span-3 space-y-6">
          {/* Room Grid */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
            <RoomGrid
              checkIn={checkIn}
              checkOut={checkOut}
              selectedRoomId={selectedRoom}
              onRoomSelect={setSelectedRoom}
            />
          </div>

          {/* Dates and Billing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Selection */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4">Select Dates</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Billing Panel */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <BillingPanel
                checkIn={checkIn}
                checkOut={checkOut}
                nights={calculateNights()}
                room={getSelectedRoomData()}
                totalAmount={totalAmount()}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleProceedToPayment}
              className="w-full py-4 bg-yellow-400 text-blue-900 font-bold text-lg rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedClient || !checkIn || !checkOut || !selectedRoom}
            >
              Proceed to Payment ({calculateNights()} nights - ₱{totalAmount().toLocaleString()})
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg p-6 max-w-sm w-full shadow-lg border-l-4 ${
            modal.type === "confirm" ? "border-blue-500" : modal.type === "success" ? "border-green-500" : "border-red-500"
          }`}>
            <h2 className={`text-lg font-bold mb-2 ${
              modal.type === "confirm" ? "text-blue-600" : modal.type === "success" ? "text-green-600" : "text-red-600"
            }`}>
              {modal.title}
            </h2>
            <p className="text-gray-700 mb-6">{modal.message}</p>
            <div className="flex gap-3">
              {modal.type === "confirm" ? (
                <>
                  <button
                    onClick={modal.action}
                    className="flex-1 py-2 bg-yellow-400 text-blue-900 rounded font-bold hover:bg-yellow-500 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setModal({ ...modal, isOpen: false })}
                    className="flex-1 py-2 bg-gray-300 text-gray-800 rounded font-bold hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setModal({ ...modal, isOpen: false })}
                  className="w-full py-2 bg-(--primary-blue) text-white rounded font-bold hover:bg-blue-900 transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
