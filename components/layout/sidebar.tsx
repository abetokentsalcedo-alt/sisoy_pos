"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { storage } from "@/lib/storage"
import { LayoutDashboard, Plus, BookOpen, Building2, BarChart3, Settings, CheckCircle, CreditCard, Users } from "lucide-react"

interface SidebarItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface CheckIn {
  id: string
  clientName: string
  roomName: string
  date: string
}

const menuItems: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "New Booking", href: "/booking/new", icon: <Plus className="w-5 h-5" /> },
  { label: "Bookings", href: "/bookings", icon: <BookOpen className="w-5 h-5" /> },
  { label: "Customers", href: "/customers", icon: <Users className="w-5 h-5" /> },
  { label: "Transactions", href: "/transactions", icon: <CreditCard className="w-5 h-5" /> },
  { label: "Accommodations", href: "/accommodations", icon: <Building2 className="w-5 h-5" /> },
  { label: "Reports", href: "/reports", icon: <BarChart3 className="w-5 h-5" /> },
  { label: "Settings", href: "/settings", icon: <Settings className="w-5 h-5" /> },
]

export function Sidebar() {
  const pathname = usePathname()
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    const bookings = storage.getBookings()
    const accommodations = storage.getAccommodations()
    const clients = storage.getClients()

    const todayCheckIns = bookings
      .filter((b) => b.dateFrom === today && b.status === "confirmed")
      .map((b) => {
        const accommodation = accommodations.find((a) => a.id === b.accommodationId)
        const client = clients.find((c) => c.id === b.clientId)
        return {
          id: b.id,
          clientName: `${client?.firstName || "N/A"} ${client?.lastName || ""}`,
          roomName: accommodation?.name || "N/A",
          date: b.dateFrom,
        }
      })

    setCheckIns(todayCheckIns)
  }, [])

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-[60px] left-0 right-0 bg-blue-900 p-2 z-20 flex items-center justify-between border-b border-blue-800">
        <div className="flex gap-2 overflow-x-auto flex-1">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-center gap-1 px-3 py-2 rounded transition-colors whitespace-nowrap text-xs font-medium ${
                  isActive ? "bg-yellow-400 text-blue-900" : "bg-blue-800 text-white hover:bg-blue-700"
                }`}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-[60px] w-60 h-[calc(100vh-60px)] bg-blue-900 text-white flex-col z-30">
        <nav className="flex flex-col gap-0 flex-1">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-6 py-3 text-base transition-colors flex items-center gap-3 ${
                  isActive ? "bg-white text-blue-900 font-bold" : "text-white hover:bg-blue-800"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Check-Ins */}
        <div className="border-t border-blue-800 pt-4 px-6 pb-6">
          <h3 className="text-xs font-bold uppercase text-yellow-400 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Today's Check-Ins
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {checkIns.length === 0 ? (
              <p className="text-xs text-blue-200">No check-ins today</p>
            ) : (
              checkIns.map((checkIn) => (
                <div key={checkIn.id} className="bg-blue-800 p-2 rounded text-xs">
                  <p className="font-bold text-white">{checkIn.clientName}</p>
                  <p className="text-yellow-300">{checkIn.roomName}</p>
                  <p className="text-blue-100 text-xs">{new Date(checkIn.date).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
