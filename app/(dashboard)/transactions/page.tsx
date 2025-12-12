"use client"

import { useState, useEffect } from "react"
import { getApiBase } from "@/lib/api"

interface Transaction {
  id: number
  booking_id: number
  customer_id: number
  amount: number
  payment_method: string
  status: string
  transaction_reference: string
  description: string
  created_at: string
}

interface ModalState {
  isOpen: boolean
  type: "success" | "error" | null
  title: string
  message: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<Partial<Transaction>>({})
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: null,
    title: "",
    message: "",
  })

  // Load transactions on mount
  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    setLoading(true)
    const apiBase = getApiBase()
    try {
      const resp = await fetch(`${apiBase}/transactions?action=list`)
      if (resp.ok) {
        const data = await resp.json()
        setTransactions(data.data || [])
      } else {
        console.error("Failed to load transactions")
      }
    } catch (error) {
      console.error("Error loading transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this transaction? This cannot be undone.")) return

    const apiBase = getApiBase()
    try {
      const resp = await fetch(`${apiBase}/transactions?id=${id}`, {
        method: "DELETE",
      })
      if (resp.ok) {
        setTransactions(transactions.filter((t) => t.id !== id))
        setModal({
          isOpen: true,
          type: "success",
          title: "Success",
          message: "Transaction deleted successfully",
        })
      } else {
        setModal({
          isOpen: true,
          type: "error",
          title: "Error",
          message: "Failed to delete transaction",
        })
      }
    } catch (error) {
      console.error("Error deleting transaction:", error)
      setModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Error deleting transaction",
      })
    }
  }

  const handleEditStart = (transaction: Transaction) => {
    setEditingId(transaction.id)
    setEditData(transaction)
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditData({})
  }

  const handleEditSave = async (id: number) => {
    const apiBase = getApiBase()
    try {
      const resp = await fetch(`${apiBase}/transactions?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      })
      if (resp.ok) {
        const updated = await resp.json()
        setTransactions(
          transactions.map((t) => (t.id === id ? { ...t, ...updated } : t))
        )
        setEditingId(null)
        setEditData({})
        setModal({
          isOpen: true,
          type: "success",
          title: "Success",
          message: "Transaction updated successfully",
        })
      } else {
        setModal({
          isOpen: true,
          type: "error",
          title: "Error",
          message: "Failed to update transaction",
        })
      }
    } catch (error) {
      console.error("Error updating transaction:", error)
      setModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Error updating transaction",
      })
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Loading transactions...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-(--primary-blue)">Transactions</h1>
        <p className="text-(--gray-dark) mt-2">Manage all payment transactions</p>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-(--gray-light) rounded overflow-x-auto">
        <table className="w-full">
          <thead className="bg-(--gray-bg) border-b border-(--gray-light)">
            <tr>
              <th className="text-left py-3 px-4 font-bold text-(--gray-dark)">ID</th>
              <th className="text-left py-3 px-4 font-bold text-(--gray-dark)">Booking ID</th>
              <th className="text-left py-3 px-4 font-bold text-(--gray-dark)">Customer ID</th>
              <th className="text-left py-3 px-4 font-bold text-(--gray-dark)">Amount</th>
              <th className="text-left py-3 px-4 font-bold text-(--gray-dark)">Payment Method</th>
              <th className="text-left py-3 px-4 font-bold text-(--gray-dark)">Status</th>
              <th className="text-left py-3 px-4 font-bold text-(--gray-dark)">Reference</th>
              <th className="text-left py-3 px-4 font-bold text-(--gray-dark)">Date</th>
              <th className="text-left py-3 px-4 font-bold text-(--gray-dark)">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} className="border-b border-(--gray-light) hover:bg-(--gray-bg)">
                <td className="py-3 px-4 text-sm font-mono">{txn.id}</td>
                <td className="py-3 px-4 text-sm">{txn.booking_id}</td>
                <td className="py-3 px-4 text-sm">{txn.customer_id}</td>
                <td className="py-3 px-4 text-sm font-bold">
                  {editingId === txn.id ? (
                    <input
                      type="number"
                      step="0.01"
                      value={editData.amount || txn.amount}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          amount: parseFloat(e.target.value),
                        })
                      }
                      className="w-24 px-2 py-1 border border-gray-300 rounded"
                    />
                  ) : (
                    `₱${txn.amount.toLocaleString()}`
                  )}
                </td>
                <td className="py-3 px-4 text-sm">
                  {editingId === txn.id ? (
                    <input
                      type="text"
                      value={editData.payment_method || txn.payment_method}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          payment_method: e.target.value,
                        })
                      }
                      className="w-32 px-2 py-1 border border-gray-300 rounded"
                    />
                  ) : (
                    txn.payment_method
                  )}
                </td>
                <td className="py-3 px-4 text-sm">
                  {editingId === txn.id ? (
                    <select
                      value={editData.status || txn.status}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          status: e.target.value,
                        })
                      }
                      className="px-2 py-1 border border-gray-300 rounded"
                    >
                      <option>completed</option>
                      <option>pending</option>
                      <option>failed</option>
                      <option>refunded</option>
                    </select>
                  ) : (
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        txn.status === "completed"
                          ? "bg-green-100 text-green"
                          : txn.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : txn.status === "failed"
                          ? "bg-red-100 text-red"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {txn.status}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-sm font-mono text-xs">
                  {txn.transaction_reference}
                </td>
                <td className="py-3 px-4 text-sm text-(--gray-dark)">
                  {new Date(txn.created_at).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-sm space-x-2">
                  {editingId === txn.id ? (
                    <>
                      <button
                        onClick={() => handleEditSave(txn.id)}
                        className="text-green hover:underline font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="text-gray-500 hover:underline"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditStart(txn)}
                        className="text-(--primary-blue) hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(txn.id)}
                        className="text-red hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-12 bg-(--gray-bg) rounded">
          <p className="text-(--gray-dark)">No transactions found.</p>
        </div>
      )}

      {/* Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg p-6 max-w-sm w-full shadow-lg border-l-4 ${
            modal.type === "success" ? "border-green-500" : "border-red-500"
          }`}>
            <h2 className={`text-lg font-bold mb-2 ${
              modal.type === "success" ? "text-green-600" : "text-red-600"
            }`}>
              {modal.title}
            </h2>
            <p className="text-gray-700 mb-6">{modal.message}</p>
            <button
              onClick={() => setModal({ ...modal, isOpen: false })}
              className="w-full py-2 bg-(--primary-blue) text-white rounded font-bold hover:bg-blue-900 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
