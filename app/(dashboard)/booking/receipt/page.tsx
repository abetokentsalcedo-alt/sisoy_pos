"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { storage, type Booking } from "@/lib/storage"

export default function ReceiptPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId")
  const [booking, setBooking] = useState<Booking | null>(null)

  useEffect(() => {
    if (bookingId) {
      const b = storage.getBookings().find((b) => b.id === bookingId)
      setBooking(b || null)
    }
  }, [bookingId])

  if (!booking) return <div>Loading...</div>

  const client = storage.getClients().find((c) => c.id === booking.clientId)
  const customerName = (booking as any).customerName || `${client?.firstName || ''} ${client?.lastName || ''}`.trim()
  const accommodation = storage.getAccommodations().find((a) => a.id === booking.accommodationId)

  const nights = Math.floor(
    (new Date(booking.dateTo).getTime() - new Date(booking.dateFrom).getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <div className="min-h-screen bg-(--gray-bg) flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white border border-(--gray-light) rounded-lg p-8">
        <div className="text-center mb-8 border-b border-(--gray-light) pb-6">
          <h1 className="text-3xl font-bold text-(--primary-blue) mb-1">RECEIPT</h1>
          <p className="text-(--gray-dark)">Booking Reference: {booking.id}</p>
          <p className="text-sm text-(--gray-dark)">Transaction ID: {booking.transactionId}</p>
        </div>

        <div className="space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="font-bold text-(--gray-dark) mb-2">Customer Information</h3>
            <div className="text-sm text-(--gray-dark) space-y-1">
              <p>
                <strong>Name:</strong> {customerName || 'N/A'}
              </p>
              <p>
                <strong>Email:</strong> {client?.email || 'N/A'}
              </p>
              <p>
                <strong>Phone:</strong> {client?.phoneNumber || 'N/A'}
              </p>
            </div>
          </div>

          {/* Booking Details */}
          <div>
            <h3 className="font-bold text-(--gray-dark) mb-2">Accommodation</h3>
            <div className="text-sm text-(--gray-dark) space-y-1">
              <p>
                <strong>Name:</strong> {accommodation?.name || 'N/A'}
              </p>
              <p>
                <strong>Type:</strong> {accommodation?.type || 'N/A'}
              </p>
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

          {/* Billing */}
          <div className="border-t border-b border-(--gray-light) py-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Rate per night:</span>
              <span>₱{accommodation?.pricePerNight || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span>Nights:</span>
              <span>{nights}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-(--primary-blue)">₱{booking.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Status */}
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-green text-white rounded font-bold mb-4">
              ✓ Payment Successful
            </div>
            <p className="text-sm text-(--gray-dark)">Status: {booking.status.toUpperCase()}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => window.print()}
              className="flex-1 py-2 bg-(--primary-blue) text-white rounded font-bold hover:bg-blue-900"
            >
              Print Receipt
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="flex-1 py-2 bg-(--yellow) text-(--gray-dark) rounded font-bold hover:bg-yellow-400"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
