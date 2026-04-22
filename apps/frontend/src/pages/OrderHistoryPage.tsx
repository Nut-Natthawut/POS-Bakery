import { useEffect, useState } from "react"
import { ReceiptModal } from "../components/ReceiptModal"
import { getOrderHistory } from "../services/orderHistoryApi"
import { getReceipt } from "../services/receiptApi"
import type { OrderHistoryItem } from "../types/orderHistory"
import type { ReceiptData } from "../types/receipt"

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<OrderHistoryItem[]>([])
  const [receipt, setReceipt] = useState<ReceiptData | null>(null)
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isReceiptLoading, setIsReceiptLoading] = useState(false)

  // โหลด order history จาก backend
  const loadOrderHistory = async (nextStartDate?: string, nextEndDate?: string) => {
    try {
      setIsLoading(true)
      setError("")

      const result = await getOrderHistory(nextStartDate, nextEndDate)
      setOrders(result.data)
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load order history"
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrderHistory()
  }, [])

  // กรองข้อมูลตามช่วงวันที่
  const handleFilter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await loadOrderHistory(startDate, endDate)
  }

  // ล้าง filter และโหลดข้อมูลใหม่
  const handleResetFilter = async () => {
    setStartDate("")
    setEndDate("")
    await loadOrderHistory()
  }

  // กดดูใบเสร็จย้อนหลังจาก order_id
  const handleViewReceipt = async (orderId: string) => {
    try {
      setIsReceiptLoading(true)
      setError("")

      const result = await getReceipt(orderId)
      setReceipt(result.data)
      setIsReceiptOpen(true)
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load receipt"
      )
    } finally {
      setIsReceiptLoading(false)
    }
  }

  return (
    <>
      <main className="px-4 py-6">
        <section className="mx-auto max-w-7xl space-y-6">
          <div>
            <p className="text-sm text-black/60">Order Management</p>
            <h1 className="text-3xl font-semibold">Order History</h1>
            <p className="mt-1 text-sm text-black/60">
              ดูประวัติการขายย้อนหลังและกดดูใบเสร็จได้
            </p>
          </div>

          {error ? (
            <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <form
            onSubmit={handleFilter}
            className="grid gap-3 rounded-md border p-4 md:grid-cols-[1fr_1fr_auto_auto]"
          >
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="h-fit self-end rounded-md bg-black px-4 py-2 text-white"
            >
              Filter
            </button>

            <button
              type="button"
              onClick={handleResetFilter}
              className="h-fit self-end rounded-md border px-4 py-2"
            >
              Reset
            </button>
          </form>

          {isLoading ? (
            <p className="text-sm text-black/60">Loading order history...</p>
          ) : null}

          {!isLoading && orders.length === 0 ? (
            <div className="rounded-md border p-6 text-sm text-black/60">
              No order history found
            </div>
          ) : null}

          {orders.length > 0 ? (
            <div className="overflow-x-auto rounded-md border">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-black/5 text-left">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Seller</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3">Discount</th>
                    <th className="px-4 py-3">VAT</th>
                    <th className="px-4 py-3">Grand Total</th>
                    <th className="px-4 py-3">Created At</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order.order_id} className="border-t">
                      <td className="px-4 py-3">{order.order_id}</td>
                      <td className="px-4 py-3">{order.seller_name}</td>
                      <td className="px-4 py-3">{order.item_count}</td>
                      <td className="px-4 py-3">
                        {order.total_discount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        {order.total_vat.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        {order.grand_total.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(order.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleViewReceipt(order.order_id)}
                          disabled={isReceiptLoading}
                          className="rounded-md border px-3 py-1"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </main>

      <ReceiptModal
        isOpen={isReceiptOpen}
        receipt={receipt}
        onClose={() => setIsReceiptOpen(false)}
      />
    </>
  )
}
