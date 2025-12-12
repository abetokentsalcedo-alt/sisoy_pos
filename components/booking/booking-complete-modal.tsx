"use client"

import { useState } from "react"
import jsPDF from "jspdf"
import type { Booking } from "@/lib/storage"

interface BookingCompleteModalProps {
  booking: Booking
  clientName: string
  accommodationName: string
  checkIn: string
  checkOut: string
  nights: number
  onClose: () => void
}

export default function BookingCompleteModal({
  booking,
  clientName,
  accommodationName,
  checkIn,
  checkOut,
  nights,
  onClose,
}: BookingCompleteModalProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const displayAmount = (typeof booking.totalAmount === 'number')
    ? booking.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : String(booking.totalAmount)

  const generatePDFReceipt = () => {
    setIsGeneratingPDF(true)

    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      // Set colors
      const blueColor = [30, 58, 138] // #1E3A8A
      const yellowColor = [250, 204, 21] // #FACC15
      const grayColor = [50, 50, 50]

      // Header with background
      doc.setFillColor(blueColor[0], blueColor[1], blueColor[2])
      doc.rect(0, 0, pageWidth, 40, "F")

      doc.setTextColor(250, 204, 21)
      doc.setFontSize(28)
      doc.setFont("helvetica", "bold")
      doc.text("SISOY POS", pageWidth / 2, 20, { align: "center" })

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)
      doc.text("BOOKING RECEIPT", pageWidth / 2, 32, { align: "center" })

      // Receipt details
      let yPosition = 50

      // Booking ID and Date
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")

      doc.text(`Booking ID: ${booking.id}`, 20, yPosition)
      yPosition += 8
      doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 20, yPosition)
      yPosition += 12

      // Divider
      doc.setDrawColor(blueColor[0], blueColor[1], blueColor[2])
      doc.line(20, yPosition, pageWidth - 20, yPosition)
      yPosition += 10

      // Guest Information
      doc.setFont("helvetica", "bold")
      doc.setFontSize(11)
      doc.setTextColor(blueColor[0], blueColor[1], blueColor[2])
      doc.text("GUEST INFORMATION", 20, yPosition)
      yPosition += 8

      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
      doc.text(`Name: ${clientName}`, 25, yPosition)
      yPosition += 6
      doc.text(`Booking Date: ${new Date(booking.createdAt).toLocaleDateString()}`, 25, yPosition)
      yPosition += 12

      // Accommodation Details
      doc.setFont("helvetica", "bold")
      doc.setFontSize(11)
      doc.setTextColor(blueColor[0], blueColor[1], blueColor[2])
      doc.text("ACCOMMODATION DETAILS", 20, yPosition)
      yPosition += 8

      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
      doc.text(`Accommodation: ${accommodationName}`, 25, yPosition)
      yPosition += 6
      doc.text(`Check-In: ${new Date(checkIn).toLocaleDateString()}`, 25, yPosition)
      yPosition += 6
      doc.text(`Check-Out: ${new Date(checkOut).toLocaleDateString()}`, 25, yPosition)
      yPosition += 6
      doc.text(`Number of Nights: ${nights}`, 25, yPosition)
      yPosition += 12

      // Billing Summary
      doc.setFont("helvetica", "bold")
      doc.setFontSize(11)
      doc.setTextColor(blueColor[0], blueColor[1], blueColor[2])
      doc.text("BILLING SUMMARY", 20, yPosition)
      yPosition += 8

      // Summary table - use ASCII-safe currency labels to avoid encoding issues
      const tableData = [
        ["Description", "Amount"],
        [`${accommodationName} x ${nights} nights`, `PHP ${displayAmount}`],
        ["Discount", "PHP 0.00"],
        ["Service Charge", "PHP 0.00"],
        ["Tax (0%)", "PHP 0.00"],
      ]

      doc.setFontSize(10)
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])

      tableData.forEach((row, index) => {
        const isHeader = index === 0
        if (isHeader) doc.setFont("helvetica", "bold")
        else doc.setFont("helvetica", "normal")

        doc.text(row[0], 25, yPosition)
        doc.text(row[1], pageWidth - 40, yPosition, { align: "right" })
        yPosition += 6
      })

      // Total
      yPosition += 2
      doc.setDrawColor(blueColor[0], blueColor[1], blueColor[2])
      doc.line(20, yPosition, pageWidth - 20, yPosition)
      yPosition += 6

      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      doc.setTextColor(blueColor[0], blueColor[1], blueColor[2])
      doc.text("TOTAL AMOUNT", 25, yPosition)
      // Use ASCII-friendly currency label in PDF to avoid font/encoding issues
      doc.text(`PHP ${displayAmount}`, pageWidth - 40, yPosition, { align: "right" })

      yPosition += 14

      // Payment Info
      doc.setDrawColor(blueColor[0], blueColor[1], blueColor[2])
      doc.line(20, yPosition, pageWidth - 20, yPosition)
      yPosition += 8

      doc.setFont("helvetica", "bold")
      doc.setFontSize(10)
      doc.setTextColor(blueColor[0], blueColor[1], blueColor[2])
      doc.text("PAYMENT INFORMATION", 20, yPosition)
      yPosition += 8

      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
      doc.text(`Payment Status: PAID`, 25, yPosition)
      yPosition += 6
      const txnId = booking.transactionId || (booking as any).transaction_reference || 'N/A'
      doc.text(`Transaction ID: ${txnId}`, 25, yPosition)
      yPosition += 12

      // Footer
      doc.setDrawColor(blueColor[0], blueColor[1], blueColor[2])
      doc.line(20, yPosition, pageWidth - 20, yPosition)
      yPosition += 8

      doc.setFont("helvetica", "italic")
      doc.setFontSize(9)
      doc.setTextColor(150, 150, 150)
      doc.text("Thank you for booking with Sisoy POS", pageWidth / 2, yPosition, { align: "center" })
      yPosition += 5
      doc.text("For inquiries, please contact us", pageWidth / 2, yPosition, { align: "center" })

      // Save PDF
      doc.save(`Receipt_${booking.id}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate receipt. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl space-y-6 animate-in">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="bg-green-100 rounded-full p-4">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Booking Complete!</h2>
          <p className="text-gray-600 text-sm">Your reservation has been confirmed</p>
        </div>

        {/* Booking Details */}
        <div className="bg-blue-50 rounded-lg p-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Booking ID</span>
            <span className="font-bold text-gray-900">{booking.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Room</span>
            <span className="font-bold text-gray-900">{accommodationName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Nights</span>
            <span className="font-bold text-gray-900">{nights}</span>
          </div>
          <div className="border-t border-blue-200 pt-3 mt-3 flex justify-between">
            <span className="font-bold text-gray-800">Total Amount</span>
            <span className="font-bold text-yellow-500 text-lg">₱{displayAmount}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={generatePDFReceipt}
            disabled={isGeneratingPDF}
            className="w-full py-3 bg-blue-900 text-white font-bold rounded hover:bg-blue-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8l-6-4m6 4l6-4"
              />
            </svg>
            {isGeneratingPDF ? "Generating..." : "Download Receipt PDF"}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-yellow-400 text-blue-900 font-bold rounded hover:bg-yellow-500 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
