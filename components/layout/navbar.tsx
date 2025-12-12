"use client"

import { useRouter } from "next/navigation"
import { storage } from "@/lib/storage"

export function Navbar() {
  const router = useRouter()
  const user = storage.getUser()

  const handleLogout = () => {
    storage.logout()
    router.push("/login")
  }

  const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 h-[60px] bg-white border-b border-(--gray-light) flex items-center justify-between px-6 z-40">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-(--primary-blue) flex items-center justify-center">
          <span className="text-white font-bold text-sm">SB</span>
        </div>
        <span className="text-xl font-bold text-(--primary-blue)">Sisoy Booking POS</span>
      </div>

      <div className="flex items-center gap-8">
        <div className="text-sm text-(--gray-dark)">{formatDate()}</div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-(--gray-dark)">{user?.username}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm text-white bg-(--primary-blue) rounded hover:bg-blue-900"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
