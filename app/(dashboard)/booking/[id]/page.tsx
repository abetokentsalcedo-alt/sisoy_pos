"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { storage, type Booking } from "@/lib/storage"

interface ModalState {
  isOpen: boolean
  type: "success" | "error" | "confirm" | null
  title: string
  message: string
  action?: () => void
}

export default function BookingDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const bookingId = params.id as string
  const [booking, setBooking] = useState<Booking | null>(null)
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: null,
    title: "",
    message: "",
  })

  useEffect(() => {
    const b = storage.getBookings().find((b) => b.id === bookingId)
    setBooking(b || null)
  }, [bookingId])

  if (!booking) return <div className="text-center py-12">Loading...</div>

  const client = storage.getClients().find((c) => c.id === booking.clientId)
  const customerName = (booking as any).customerName || `${client?.firstName || ''} ${client?.lastName || ''}`.trim()
  const accommodation = storage.getAccommodations().find((a) => a.id === booking.accommodationId)

  const nights = Math.floor(
    (new Date(booking.dateTo).getTime() - new Date(booking.dateFrom).getTime()) / (1000 * 60 * 60 * 24),
  )

  const handleStatusChange = (newStatus: string) => {
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Update Booking Status",
      message: `Change status from "${booking?.status}" to "${newStatus}"?`,
      action: () => {
        storage.updateBooking(bookingId, { status: newStatus as any })
        setBooking({ ...booking!, status: newStatus as any })
        setModal({
          isOpen: true,
          type: "success",
          title: "Success",
          message: `Booking status updated to ${newStatus}`,
        })
      },
    })
  }

  const handlePaymentStatus = () => {
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Mark as Paid",
      message: "Are you sure you want to mark this booking as paid?",
      action: () => {
        storage.updateBooking(bookingId, {
          paymentStatus: "paid",
          transactionId: `TEST${Date.now()}`,
        })
        setBooking({ ...booking!, paymentStatus: "paid", transactionId: `TEST${Date.now()}` })
        setModal({
          isOpen: true,
          type: "success",
          title: "Success",
          message: "Booking marked as paid",
        })
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-(--primary-blue)">Booking Details</h1>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-(--primary-blue) text-white rounded font-bold hover:bg-blue-900"
        >
          Print Receipt
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left - Booking Info */}
        <div className="bg-white border border-(--gray-light) rounded p-6 space-y-6">
          <div>
            <h3 className="font-bold text-(--gray-dark) mb-3">Customer Information</h3>
            <div className="space-y-2 text-sm text-(--gray-dark)">
              <p>
                <strong>Name:</strong> {customerName || 'N/A'}
              </p>
              <p>
                <strong>Email:</strong> {client?.email}
              </p>
              <p>
                <strong>Phone:</strong> {client?.phoneNumber}
              </p>
              <p>
                <strong>Address:</strong> {client?.address || "N/A"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-(--gray-dark) mb-3">Accommodation</h3>
            <div className="space-y-2 text-sm text-(--gray-dark)">
              <p>
                <strong>Name:</strong> {accommodation?.name}
              </p>
              <p>
                <strong>Type:</strong> {accommodation?.type}
              </p>
              <p>
                <strong>Capacity:</strong> {accommodation?.capacity} guests
              </p>
              <p>
                <strong>Description:</strong> {accommodation?.description}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-(--gray-dark) mb-3">Dates</h3>
            <div className="space-y-2 text-sm text-(--gray-dark)">
              <p>
                <strong>Check-in:</strong> {booking.dateFrom}
              </p>
              <p>
                <strong>Check-out:</strong> {booking.dateTo}
              </p>
              <p>
                <strong>Nights:</strong> {nights}
              </p>
            </div>
          </div>
        </div>

        {/* Right - Billing & Actions */}
        <div className="space-y-6">
          {/* Billing */}
          <div className="bg-white border border-(--gray-light) rounded p-6">
            <h3 className="font-bold text-(--gray-dark) mb-4">Billing</h3>
            <div className="space-y-2 text-sm mb-4 border-b border-(--gray-light) pb-4">
              <div className="flex justify-between">
                <span>Rate per night:</span>
                <span className="font-bold">₱{accommodation?.pricePerNight}</span>
              </div>
              <div className="flex justify-between">
                <span>Nights:</span>
                <span className="font-bold">{nights}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-(--primary-blue)">₱{booking.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-sm">
              <p className="text-(--gray-dark) mb-2">
                <strong>Payment Status:</strong>
              </p>
              <div className="flex gap-2">
                <span
                  className={`px-3 py-1 rounded font-bold ${
                    booking.paymentStatus === "paid" ? "bg-green-100 text-green" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {booking.paymentStatus === "paid" ? "✓ Paid" : "Unpaid"}
                </span>
              </div>
            </div>
          </div>

          {/* Status & Actions */}
          <div className="bg-white border border-(--gray-light) rounded p-6 space-y-4">
            <div>
              <label className="block text-sm font-bold text-(--gray-dark) mb-2">Status</label>
              <select
                value={booking.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-3 py-2 border border-(--gray-light) rounded"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <button
              onClick={handlePaymentStatus}
              disabled={booking.paymentStatus === "paid"}
              className="w-full py-2 bg-(--yellow) text-(--gray-dark) rounded font-bold hover:bg-yellow-400 disabled:opacity-50"
            >
              {booking.paymentStatus === "paid" ? "Already Paid" : "Mark as Paid"}
            </button>

            <button
              onClick={() => router.push("/bookings")}
              className="w-full py-2 bg-(--primary-blue) text-white rounded font-bold hover:bg-blue-900"
            >
              Back to Bookings
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
                    className="flex-1 py-2 bg-blue-500 text-white rounded font-bold hover:bg-blue-600 transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setModal({ ...modal, isOpen: false })}
                    className="flex-1 py-2 bg-gray-300 text-gray-800 rounded font-bold hover:bg-gray-400 transition-colors"
                  >
                    No
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
