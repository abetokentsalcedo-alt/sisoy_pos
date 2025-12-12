"use client"

import { useRouter } from "next/navigation"
import { storage } from "@/lib/storage"

export default function SettingsPage() {
  const router = useRouter()
  const user = storage.getUser()

  const handleLogout = () => {
    storage.logout()
    router.push("/login")
  }

  const handleClearData = () => {
    if (confirm("This will clear all data. Are you sure?")) {
      localStorage.clear()
      router.push("/login")
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-(--primary-blue)">Settings</h1>

      {/* Account */}
      <div className="bg-white border border-(--gray-light) rounded p-6">
        <h2 className="text-lg font-bold text-(--gray-dark) mb-4">Account</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-(--gray-dark)">Logged in as:</p>
            <p className="text-lg font-bold text-(--primary-blue)">{user?.username}</p>
          </div>
          <button onClick={handleLogout} className="px-6 py-2 bg-red text-white rounded font-bold hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>

      {/* System */}
      <div className="bg-white border border-(--gray-light) rounded p-6">
        <h2 className="text-lg font-bold text-(--gray-dark) mb-4">System</h2>
        <div className="space-y-3">
          <p className="text-sm text-(--gray-dark)">This is a demo POS system for hotel booking management.</p>
          <button onClick={handleClearData} className="px-6 py-2 bg-red text-white rounded font-bold hover:bg-red-600">
            Clear All Data
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-(--gray-bg) border border-(--gray-light) rounded p-6">
        <h3 className="font-bold text-(--gray-dark) mb-2">Sisoy Booking POS</h3>
        <p className="text-sm text-(--gray-dark)">
          Hotel Booking & Point of Sale Management System
          <br />
          Demo Version 1.0
        </p>
      </div>
    </div>
  )
}
