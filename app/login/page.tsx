"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { storage } from "@/lib/storage"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === "admin" && password === "admin") {
      storage.setUser({ username })
      router.push("/dashboard")
    } else {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-bold text-(--primary-blue) mb-2 text-6xl">Sisoy POS</h1>
          <p className="text-(--gray-dark)">Hotel Booking Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-(--gray-bg) p-8 rounded-lg border border-(--gray-light)">
          <div>
            <label className="block text-sm font-medium text-(--gray-dark) mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-(--gray-light) rounded focus:outline-none focus:border-(--primary-blue)"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-(--gray-dark) mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-(--gray-light) rounded focus:outline-none focus:border-(--primary-blue)"
              placeholder="Enter password"
            />
          </div>

          {error && <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full py-3 bg-(--yellow) text-(--gray-dark) font-bold rounded hover:bg-yellow-400 transition-colors"
          >
            Sign In
          </button>

          <div className="text-center text-sm text-(--gray-dark)">
            
          </div>
        </form>
      </div>
    </div>
  )
}
