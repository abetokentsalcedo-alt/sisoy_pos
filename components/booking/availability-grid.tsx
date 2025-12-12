"use client"
import RoomGrid from "./room-grid"

interface AvailabilityGridProps {
  checkIn: string
  checkOut: string
  onCheckInChange: (date: string) => void
  onCheckOutChange: (date: string) => void
  selectedRoomId: string
  onRoomSelect: (id: string) => void
}

export default function AvailabilityGrid({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  selectedRoomId,
  onRoomSelect,
}: AvailabilityGridProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-700">Dates & Availability</h3>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => onCheckInChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => onCheckOutChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      <RoomGrid checkIn={checkIn} checkOut={checkOut} selectedRoomId={selectedRoomId} onRoomSelect={onRoomSelect} />
    </div>
  )
}
