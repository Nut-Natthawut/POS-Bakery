import { useEffect, useState } from "react"
import { ReceiptModal } from "../components/ReceiptModal"
import { DataTableShell } from "../components/ui/DataTableShell"
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

  const orderCountLabel = `${orders.length} bills`
  const totalRevenueLabel = `${orders
    .reduce((total, order) => total + order.grand_total, 0)
    .toFixed(2)} total`
  const latestDateLabel =
    orders.length > 0
      ? new Date(orders[0].created_at).toLocaleDateString()
      : "No data"

  return (
    <>
      <section className="space-y-6">
          <section className="rounded-md border border-black/10 bg-white p-5 shadow-sm">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-black/45">Order Management</p>
                  <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
                    Order History
                  </h1>
                </div>

                <p className="max-w-3xl text-sm leading-6 text-black/55">
                  ดูประวัติการขายย้อนหลัง กรองตามช่วงวันที่ และเปิดใบเสร็จของแต่ละบิลได้ทันที
                </p>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-md border border-black/10 bg-black/[0.02] p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-black/45">
                      Bills
                    </p>
                    <p className="mt-2 text-2xl font-semibold">{orderCountLabel}</p>
                  </div>

                  <div className="rounded-md border border-black/10 bg-black/[0.02] p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-black/45">
                      Revenue
                    </p>
                    <p className="mt-2 text-2xl font-semibold">{totalRevenueLabel}</p>
                  </div>

                  <div className="rounded-md border border-black/10 bg-black/[0.02] p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-black/45">
                      Latest
                    </p>
                    <p className="mt-2 text-2xl font-semibold">{latestDateLabel}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-black/10 bg-[#fafaf8] p-4">
                <p className="text-sm font-medium text-black/50">History Filter</p>
                <h2 className="mt-1 text-lg font-semibold text-[#1d1d1f]">
                  เรียกดูบิลตามช่วงเวลาที่ต้องการ
                </h2>
                <p className="mt-2 text-sm leading-6 text-black/55">
                  ใช้ตัวกรองด้านล่างเพื่อลดจำนวนบิลที่ต้องไล่ดูและเปิดใบเสร็จย้อนหลังได้เร็วขึ้น
                </p>
              </div>
            </div>
          </section>

          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <form
            onSubmit={handleFilter}
            className="grid gap-3 rounded-md border border-black/10 bg-white p-4 shadow-sm xl:grid-cols-[1fr_1fr_auto_auto]"
          >
            <div>
              <label className="text-sm font-medium text-black/70">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full rounded-md border border-black/10 px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-black/70">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 w-full rounded-md border border-black/10 px-3 py-2"
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
            <div className="space-y-3">
              <div className="h-16 animate-pulse rounded-md border bg-black/5" />
              <div className="h-16 animate-pulse rounded-md border bg-black/5" />
              <div className="h-16 animate-pulse rounded-md border bg-black/5" />
            </div>
          ) : null}

          {!isLoading && orders.length === 0 ? (
            <DataTableShell
              title="Order History"
              description="ประวัติการขายย้อนหลังตามช่วงวันที่ที่เลือก"
            >
              <div className="rounded-md border border-dashed px-4 py-8 text-center text-sm text-black/60">
                ไม่พบประวัติการขายตามเงื่อนไขที่ค้นหา
              </div>
            </DataTableShell>
          ) : null}

          {orders.length > 0 ? (
            <DataTableShell
              title="Order History"
              description="ดูรายการบิลย้อนหลังและกดดูใบเสร็จทีละบิลได้"
            >
              <>
                <div className="grid gap-3 xl:hidden">
                  {orders.map((order) => (
                    <article
                      key={order.order_id}
                      className="rounded-md border border-black/10 p-4"
                    >
                      <p className="break-words text-sm font-medium text-black/80">
                        {order.order_id}
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-black/70">
                        <p>Seller: {order.seller_name}</p>
                        <p>Items: {order.item_count}</p>
                        <p>Total: {order.grand_total.toFixed(2)}</p>
                        <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleViewReceipt(order.order_id)}
                        disabled={isReceiptLoading}
                        className="mt-3 rounded-md border border-black/15 px-3 py-1 text-sm hover:bg-black/5 disabled:opacity-50"
                      >
                        View Receipt
                      </button>
                    </article>
                  ))}
                </div>

                <table className="hidden w-full table-fixed border-collapse text-sm xl:table">
                  <thead className="bg-black/5 text-left">
                    <tr>
                      <th className="w-[190px] px-4 py-3 font-medium text-black/65">
                        Order ID
                      </th>
                      <th className="w-28 px-4 py-3 font-medium text-black/65">
                        Seller
                      </th>
                      <th className="w-24 px-4 py-3 font-medium text-black/65">
                        Items
                      </th>
                      <th className="w-28 px-4 py-3 font-medium text-black/65">
                        Discount
                      </th>
                      <th className="w-24 px-4 py-3 font-medium text-black/65">
                        VAT
                      </th>
                      <th className="w-32 px-4 py-3 font-medium text-black/65">
                        Grand Total
                      </th>
                      <th className="w-36 px-4 py-3 font-medium text-black/65">
                        Created At
                      </th>
                      <th className="w-40 px-4 py-3 font-medium text-black/65">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order.order_id}
                        className="border-t last:border-b-0"
                      >
                        <td className="break-words px-4 py-3 font-medium">
                          {order.order_id}
                        </td>
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
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleViewReceipt(order.order_id)}
                            disabled={isReceiptLoading}
                            className="rounded-md border border-black/15 px-3 py-1 text-sm hover:bg-black/5 disabled:opacity-50"
                          >
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            </DataTableShell>
          ) : null}
      </section>

      <ReceiptModal
        isOpen={isReceiptOpen}
        receipt={receipt}
        onClose={() => setIsReceiptOpen(false)}
      />
    </>
  )
}
