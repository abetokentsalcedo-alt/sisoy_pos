"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function WelcomeScreen() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      router.push("/login")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  const handleContinue = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900">
      <div className="text-center space-y-8">
        {/* Logo/Title */}
        <div className="space-y-4">
          <h1 className="text-8xl font-bold text-yellow-400" style={{ textShadow: "0 4px 6px rgba(0,0,0,0.3)" }}>
            SISOY
          </h1>
        </div>
      </div>
    </div>
  )
}
