"use client"

import { useState, useEffect } from "react"
import { storage, type Booking } from "@/lib/storage"
import { getApiBase } from "@/lib/api"

interface ModalState {
  isOpen: boolean
  type: "success" | "error" | "confirm" | null
  title: string
  message: string
  action?: () => void
}

interface EditingBooking {
  id: string
  accommodationId: string
  dateFrom: string
  dateTo: string
  totalAmount: number
}

export default function ReportsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [editingBooking, setEditingBooking] = useState<EditingBooking | null>(null)
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: null,
    title: "",
    message: "",
  })
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    // Sync reports data from server on mount - fetch ALL bookings
    syncReportsFromServer()
  }, [])

  const syncReportsFromServer = async () => {
    setLoading(true)
    const apiBase = getApiBase()
    try {
      const resp = await fetch(`${apiBase}/bookings?action=list`)
      if (resp.ok) {
        const data = await resp.json()
        // Handle both array and object with data property
        const serverBookings = Array.isArray(data) ? data : (data?.data || [])
        
        if (serverBookings.length > 0) {
          // Convert server bookings to client format
          const clientBookings: Booking[] = serverBookings.map((b: any) => ({
            id: String(b.id),
            clientId: String(b.customer_id),
            accommodationId: String(b.accommodation_id),
            dateFrom: b.check_in,
            dateTo: b.check_out,
            status: b.status.toLowerCase() === 'confirmed' ? 'confirmed' : b.status.toLowerCase() === 'completed' ? 'completed' : 'pending',
            totalAmount: parseFloat(b.total_price) || 0,
            createdAt: b.created_at || new Date().toISOString(),
            paymentStatus: 'paid',
            accommodation_name: b.accommodation_name,
          }))
          localStorage.setItem('pos_bookings', JSON.stringify(clientBookings))
          setBookings(clientBookings)
          setLoading(false)
          return
        }
      }
    } catch (e) {
      console.error('Error syncing reports from server:', e)
      // fall back to local storage if server unavailable
    }
    // Fallback: read from localStorage
    const allBookings = storage.getBookings()
    setBookings(allBookings)
    setLoading(false)
  }

  const handleCheckOut = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId)
    if (!booking) return

    setModal({
      isOpen: true,
      type: "confirm",
      title: "Check Out Booking",
      message: `Mark booking ${bookingId} as checked out?`,
      action: () => {
        // Update booking status to completed
        storage.updateBooking(bookingId, { status: "completed" })
        const updatedBookings = bookings.map((b) =>
          b.id === bookingId ? { ...b, status: "completed" as const } : b
        )
        setBookings(updatedBookings)
        localStorage.setItem('pos_bookings', JSON.stringify(updatedBookings))
        
        setModal({
          isOpen: true,
          type: "success",
          title: "Checked Out",
          message: `Booking ${bookingId} has been checked out successfully`,
        })
      },
    })
  }

  const handleEditClick = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId)
    if (!booking) return

    setEditingBooking({
      id: bookingId,
      accommodationId: booking.accommodationId,
      dateFrom: booking.dateFrom,
      dateTo: booking.dateTo,
      totalAmount: booking.totalAmount,
    })
  }

  const handleEditSave = async () => {
    if (!editingBooking) return

    // Validate required fields
    if (!editingBooking.dateFrom || !editingBooking.dateTo || !editingBooking.totalAmount) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Validation Error",
        message: "Please fill all required fields",
      })
      return
    }

    // Update booking in local state
    const updatedBookings = bookings.map((b) =>
      b.id === editingBooking.id
        ? {
            ...b,
            accommodationId: editingBooking.accommodationId,
            dateFrom: editingBooking.dateFrom,
            dateTo: editingBooking.dateTo,
            totalAmount: editingBooking.totalAmount,
          }
        : b
    )
    
    setBookings(updatedBookings)
    localStorage.setItem('pos_bookings', JSON.stringify(updatedBookings))
    
    // Update in storage
    storage.updateBooking(editingBooking.id, {
      accommodationId: editingBooking.accommodationId,
      dateFrom: editingBooking.dateFrom,
      dateTo: editingBooking.dateTo,
      totalAmount: editingBooking.totalAmount,
    })

    setEditingBooking(null)
    setModal({
      isOpen: true,
      type: "success",
      title: "Success",
      message: "Booking updated successfully",
    })
  }

  const handleEditCancel = () => {
    setEditingBooking(null)
  }

  const getFilteredBookings = () => {
    return bookings.filter((b) => {
      const date = b.dateFrom
      return date >= dateRange.start && date <= dateRange.end && b.status !== "cancelled"
    })
  }

  const getAllBookings = () => {
    return bookings.filter((b) => b.status !== "cancelled")
  }

  const calculateStats = () => {
    const filtered = getFilteredBookings()
    const totalBookings = filtered.length
    const totalRevenue = filtered.filter((b) => b.paymentStatus === "paid").reduce((sum, b) => sum + b.totalAmount, 0)
    const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0

    return { totalBookings, totalRevenue, avgBookingValue }
  }

  const getDailySalesData = () => {
    const filtered = getFilteredBookings()
    const dailyData: { [key: string]: number } = {}

    filtered.forEach((b) => {
      if (!dailyData[b.dateFrom]) {
        dailyData[b.dateFrom] = 0
      }
      dailyData[b.dateFrom] += b.totalAmount
    })

    return Object.entries(dailyData)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .slice(-7)
  }

  const getAccommodationBreakdown = () => {
    const filtered = getFilteredBookings()
    const breakdown: { [key: string]: { count: number; revenue: number } } = {}

    filtered.forEach((b) => {
      const acc = storage.getAccommodations().find((a) => a.id === b.accommodationId)
      if (acc) {
        if (!breakdown[acc.name]) {
          breakdown[acc.name] = { count: 0, revenue: 0 }
        }
        breakdown[acc.name].count++
        breakdown[acc.name].revenue += b.totalAmount
      }
    })

    return breakdown
  }

  const stats = calculateStats()
  const dailySales = getDailySalesData()
  const accommodationBreakdown = getAccommodationBreakdown()
  const allBookingsList = getAllBookings()

  const handleExportCSV = () => {
    const filtered = getFilteredBookings()
    const csv = [
      ["Date", "Customer", "Accommodation", "Amount", "Status"],
      ...filtered.map((b) => {
        const client = storage.getClients().find((c) => c.id === b.clientId)
        const acc = storage.getAccommodations().find((a) => a.id === b.accommodationId)
        const customerName = (b as any).customerName || `${client?.firstName || ''} ${client?.lastName || ''}`.trim()
        return [b.dateFrom, customerName, acc?.name, b.totalAmount, b.status]
      }),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `report-${dateRange.start}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-(--primary-blue)">Reports</h1>
        <button
          onClick={syncReportsFromServer}
          disabled={loading}
          className="px-4 py-2 bg-(--primary-blue) text-white rounded font-bold hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Syncing..." : "Sync from DB"}
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white border border-(--gray-light) rounded p-4 flex gap-4 items-end">
        <div>
          <label className="block text-sm font-bold text-(--gray-dark) mb-1">From</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="px-3 py-2 border border-(--gray-light) rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-(--gray-dark) mb-1">To</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="px-3 py-2 border border-(--gray-light) rounded"
          />
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-(--yellow) text-(--gray-dark) rounded font-bold hover:bg-yellow-400"
        >
          Export CSV
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-(--gray-light) rounded p-6">
          <p className="text-sm text-(--gray-dark) mb-1">Total Bookings</p>
          <p className="text-3xl font-bold text-(--primary-blue)">{stats.totalBookings}</p>
        </div>
        <div className="bg-white border border-(--gray-light) rounded p-6">
          <p className="text-sm text-(--gray-dark) mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-(--primary-blue)">₱{stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-(--gray-light) rounded p-6">
          <p className="text-sm text-(--gray-dark) mb-1">Avg. Booking Value</p>
          <p className="text-3xl font-bold text-(--primary-blue)">
            ₱{Math.round(stats.avgBookingValue).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Daily Sales */}
      <div className="bg-white border border-(--gray-light) rounded p-6">
        <h2 className="text-lg font-bold text-(--gray-dark) mb-4">Last 7 Days Sales</h2>
        <div className="space-y-2">
          {dailySales.map(([date, amount]) => (
            <div key={date} className="flex items-center gap-4">
              <span className="w-24 text-sm font-bold">{date}</span>
              <div className="flex-1 bg-(--gray-bg) rounded h-8 relative overflow-hidden">
                <div
                  className="bg-(--yellow) h-full transition-all absolute left-0 top-0"
                  style={{
                    width: `${Math.min(100, (amount / Math.max(...dailySales.map((d) => d[1]))) * 100)}%`,
                  }}
                />
              </div>
              <span className="w-32 text-right font-bold relative z-10">₱{amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Accommodation Breakdown */}
      <div className="bg-white border border-(--gray-light) rounded p-6">
        <h2 className="text-lg font-bold text-(--gray-dark) mb-4">Accommodation Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-(--gray-bg) border-b border-(--gray-light)">
              <tr>
                <th className="text-left py-2 px-4 font-bold">Accommodation</th>
                <th className="text-left py-2 px-4 font-bold">Bookings</th>
                <th className="text-left py-2 px-4 font-bold">Revenue</th>
                <th className="text-left py-2 px-4 font-bold">Avg/Booking</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(accommodationBreakdown).map(([name, data]) => (
                <tr key={name} className="border-b border-(--gray-light)">
                  <td className="py-3 px-4">{name}</td>
                  <td className="py-3 px-4 font-bold">{data.count}</td>
                  <td className="py-3 px-4 font-bold">₱{data.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4">₱{Math.round(data.revenue / data.count).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Bookings Table */}
      <div className="bg-white border border-(--gray-light) rounded p-6">
        <h2 className="text-lg font-bold text-(--gray-dark) mb-4">All Bookings ({allBookingsList.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-(--gray-bg) border-b border-(--gray-light)">
              <tr>
                <th className="text-left py-3 px-4 font-bold">ID</th>
                <th className="text-left py-3 px-4 font-bold">Customer</th>
                <th className="text-left py-3 px-4 font-bold">Accommodation</th>
                <th className="text-left py-3 px-4 font-bold">Check-in</th>
                <th className="text-left py-3 px-4 font-bold">Check-out</th>
                <th className="text-left py-3 px-4 font-bold">Amount</th>
                <th className="text-left py-3 px-4 font-bold">Status</th>
                <th className="text-left py-3 px-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allBookingsList.map((b) => {
                const client = storage.getClients().find((c) => c.id === b.clientId)
                const acc = storage.getAccommodations().find((a) => a.id === b.accommodationId)
                const customerName = (b as any).customerName || `${client?.firstName || ''} ${client?.lastName || ''}`.trim()
                
                return (
                  <tr key={b.id} className="border-b border-(--gray-light) hover:bg-(--gray-bg)">
                    <td className="py-3 px-4 font-mono text-xs">{b.id.substring(0, 8)}</td>
                    <td className="py-3 px-4">{customerName}</td>
                    <td className="py-3 px-4">{acc?.name}</td>
                    <td className="py-3 px-4">{b.dateFrom}</td>
                    <td className="py-3 px-4">{b.dateTo}</td>
                    <td className="py-3 px-4 font-bold">₱{b.totalAmount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        b.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : b.status === "confirmed"
                          ? "bg-green-100 text-green"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(b.id)}
                          className="px-3 py-1 bg-orange-500 text-white rounded text-xs font-bold hover:bg-orange-600"
                        >
                          Edit
                        </button>
                        {b.status !== "completed" ? (
                          <button
                            onClick={() => handleCheckOut(b.id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-xs font-bold hover:bg-blue-600"
                          >
                            Check Out
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500">Checked Out</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {allBookingsList.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No bookings found
          </div>
        )}
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
