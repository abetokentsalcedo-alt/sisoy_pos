"use client"

interface BillingPanelProps {
  checkIn: string
  checkOut: string
  nights: number
  room: any
  totalAmount: number
}

export default function BillingPanel({ checkIn, checkOut, nights, room, totalAmount }: BillingPanelProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-blue-900">Booking Summary</h3>

      <div className="space-y-3 border-b border-gray-200 pb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Check-in</span>
          <span className="font-bold text-gray-900">{checkIn ? new Date(checkIn).toLocaleDateString() : "-"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Check-out</span>
          <span className="font-bold text-gray-900">{checkOut ? new Date(checkOut).toLocaleDateString() : "-"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Room</span>
          <span className="font-bold text-gray-900">{room?.name || "Not selected"}</span>
        </div>
      </div>

      <div className="space-y-3 border-b border-gray-200 pb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Rate per night</span>
          <span className="font-bold text-blue-600">₱{room?.pricePerNight?.toLocaleString() || "0"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Number of nights</span>
          <span className="font-bold text-gray-900">{nights}</span>
        </div>
        <div className="flex justify-between text-sm bg-yellow-50 px-3 py-2 rounded-lg">
          <span className="text-gray-700 font-medium">Subtotal</span>
          <span className="font-bold text-yellow-600">₱{totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 text-center border border-blue-200">
        <p className="text-xs text-gray-600 mb-2 uppercase tracking-wide font-medium">Total Amount Due</p>
        <p className="text-4xl font-bold text-blue-900">₱{totalAmount.toLocaleString()}</p>
        <p className="text-xs text-gray-500 mt-2">
          {nights} night{nights !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  )
}
