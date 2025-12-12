"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { storage, type Booking } from "@/lib/storage"
import { getApiBase } from "@/lib/api"

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState({
    todayBookings: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    totalSales: 0,
  })

  useEffect(() => {
    const syncBookingsFromServer = async () => {
      try {
        const apiBase = getApiBase()
        
        // Fetch fresh bookings from server
        const res = await fetch(`${apiBase}/bookings?action=list`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        
        if (res.ok) {
          const data = await res.json()
          
          // Handle both array and object with data property
          const serverBookings = Array.isArray(data) ? data : (data?.data || [])
          
          // Convert server format to client Booking format (keep customer and transaction info)
          const convertedBookings: Booking[] = serverBookings.map((b: any) => ({
            id: String(b.id),
            clientId: String(b.customer_id),
            accommodationId: String(b.accommodation_id),
            dateFrom: b.check_in,
            dateTo: b.check_out,
            status: b.status?.toLowerCase() === 'confirmed' ? 'confirmed' : 'pending',
            totalAmount: parseFloat(b.total_price) || parseFloat(b.transaction_amount) || 0,
            createdAt: b.created_at,
            paymentStatus: 'paid',
            accommodation_name: b.accommodation_name, // Store room name for display
            customerName: (b.first_name || b.last_name) ? `${b.first_name || ''}${b.first_name && b.last_name ? ' ' : ''}${b.last_name || ''}`.trim() : undefined,
            transactionId: b.transaction_reference || b.transactionId || undefined,
            transactionAmount: b.transaction_amount ? parseFloat(b.transaction_amount) : undefined,
          }))
          
          // Update localStorage with fresh data
          localStorage.setItem('pos_bookings', JSON.stringify(convertedBookings))
          setBookings(convertedBookings)
          calculateStats(convertedBookings)
        } else {
          // Fallback to localStorage if server unavailable
          const allBookings = storage.getBookings()
          setBookings(allBookings)
          calculateStats(allBookings)
        }
      } catch (err) {
        console.error('Error fetching bookings:', err)
        // Fallback to localStorage
        const allBookings = storage.getBookings()
        setBookings(allBookings)
        calculateStats(allBookings)
      }
    }

    const calculateStats = (allBookings: any[]) => {
      const today = new Date().toISOString().split("T")[0]
      
      // "Bookings Today" = bookings CREATED today (createdAt date)
      const todayBookings = allBookings.filter((b) => {
        const createdDate = new Date(b.createdAt).toISOString().split("T")[0]
        return createdDate === today
      })

      const accommodations = storage.getAccommodations()
      
      // "Occupied Rooms" = rooms with active bookings today (check_in <= today < check_out)
      const occupiedToday = new Set(
        allBookings
          .filter((b) => {
            const from = new Date(b.dateFrom).toISOString().split("T")[0]
            const to = new Date(b.dateTo).toISOString().split("T")[0]
            return from <= today && today < to && b.status !== "cancelled"
          })
          .map((b) => b.accommodationId),
      ).size

      // "Total Sales" = sum of all paid bookings
      const totalSales = allBookings.filter((b) => b.paymentStatus === "paid").reduce((sum, b) => sum + b.totalAmount, 0)

      setStats({
        todayBookings: todayBookings.length,
        availableRooms: accommodations.length - occupiedToday,
        occupiedRooms: occupiedToday,
        totalSales,
      })
    }

    syncBookingsFromServer()
  }, [])

  const StatCard = ({ title, value }: { title: string; value: number | string }) => (
    <div className="bg-white border border-(--gray-light) rounded p-6 shadow-sm">
      <p className="text-sm text-(--gray-dark) mb-2">{title}</p>
      <p className="text-3xl font-bold text-(--primary-blue)">{value}</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-(--primary-blue)">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Bookings Today" value={stats.todayBookings} />
        <StatCard title="Available Rooms" value={stats.availableRooms} />
        <StatCard title="Occupied Rooms" value={stats.occupiedRooms} />
        <StatCard title="Total Sales" value={`₱${stats.totalSales.toLocaleString()}`} />
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Bookings Today Table */}
        <div className="col-span-2 bg-white border border-(--gray-light) rounded p-6">
          <h2 className="text-lg font-bold text-(--gray-dark) mb-4">Today's Bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-(--gray-light)">
                  <th className="text-left py-2 px-2 font-bold text-(--gray-dark)">Time</th>
                  <th className="text-left py-2 px-2 font-bold text-(--gray-dark)">Customer</th>
                  <th className="text-left py-2 px-2 font-bold text-(--gray-dark)">Room</th>
                  <th className="text-left py-2 px-2 font-bold text-(--gray-dark)">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="border-b border-(--gray-light)">
                    <td className="py-3 px-2">{new Date(b.createdAt).toLocaleTimeString()}</td>
                    <td className="py-3 px-2">
                      <div className="font-medium">
                        {b.customerName || storage.getClients().find((c) => c.id === b.clientId)?.firstName || "N/A"}
                      </div>
                      {((b as any).transactionId || (b as any).transaction_reference) && (
                        <div className="text-xs text-gray-500 mt-1">Txn: {b.transactionId || (b as any).transaction_reference}</div>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {(b as any).accommodation_name || storage.getAccommodations().find((a) => a.id === b.accommodationId)?.name || "N/A"}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          b.status === "confirmed"
                            ? "bg-green-100 text-green"
                            : b.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions Panel */}
        <div className="bg-white border border-(--gray-light) rounded p-6 h-fit space-y-3">
          <h2 className="text-lg font-bold text-(--gray-dark) mb-4">Quick Actions</h2>
          <Link
            href="/booking/new"
            className="block w-full py-3 bg-(--yellow) text-(--gray-dark) font-bold rounded text-center hover:bg-yellow-400 transition-colors"
          >
            New Booking
          </Link>
          <Link
            href="/accommodations"
            className="block w-full py-2 bg-(--primary-blue) text-white font-bold rounded text-center hover:bg-blue-900 transition-colors"
          >
            Accommodations
          </Link>
          <Link
            href="/reports"
            className="block w-full py-2 bg-(--primary-blue) text-white font-bold rounded text-center hover:bg-blue-900 transition-colors"
          >
            Reports
          </Link>
          <Link
            href="/bookings"
            className="block w-full py-2 bg-(--primary-blue) text-white font-bold rounded text-center hover:bg-blue-900 transition-colors"
          >
            All Bookings
          </Link>
        </div>
      </div>
    </div>
  )
}
