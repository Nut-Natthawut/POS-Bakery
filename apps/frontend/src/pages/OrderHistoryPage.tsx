import { useEffect, useState } from "react"
import { AlertCircle, FileSearch, ReceiptText, RefreshCcw } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ReceiptModal } from "../components/ReceiptModal"
import { DataTableShell } from "../components/ui/DataTableShell"
import { StatCard } from "../components/ui/StatCard"
import { getOrderHistory } from "../services/orderHistoryApi"
import { getReceipt } from "../services/receiptApi"
import type { OrderHistoryItem } from "../types/orderHistory"
import type { ReceiptData } from "../types/receipt"

export const OrderHistoryPage = () => {
  // state เก็บรายการสินค้า, หมวดหมู่, error และ loading
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
        <Card className="rounded-lg border border-black/8 bg-white/88 py-0 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <CardContent className="px-5 py-5">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-black/45">Order Management</p>
                  <h1 className="text-3xl font-semibold tracking-normal text-[#1d1d1f]">
                    Order History
                  </h1>
                </div>

                <p className="max-w-3xl text-sm leading-6 text-black/55">
                  ดูประวัติการขายย้อนหลัง กรองตามช่วงวันที่ และเปิดใบเสร็จของแต่ละบิลได้ทันที
                </p>

                <div className="grid gap-3 md:grid-cols-3">
                  <StatCard
                    label="Bills"
                    value={orderCountLabel}
                    helperText="จำนวนบิลในผลลัพธ์ปัจจุบัน"
                  />
                  <StatCard
                    label="Revenue"
                    value={totalRevenueLabel}
                    helperText="ยอดรวมของบิลที่แสดงอยู่"
                  />
                  <StatCard
                    label="Latest"
                    value={latestDateLabel}
                    helperText="วันที่ล่าสุดจากประวัติที่โหลดมา"
                  />
                </div>
              </div>

              <Card className="rounded-lg border border-black/8 bg-[#fafaf8] py-0 shadow-none">
                <CardContent className="space-y-4 px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-black/50">History Filter</p>
                    <h2 className="mt-1 text-lg font-semibold tracking-normal text-[#1d1d1f]">
                      เรียกดูบิลตามช่วงเวลาที่ต้องการ
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-black/55">
                      ใช้ตัวกรองด้านล่างเพื่อลดจำนวนบิลที่ต้องไล่ดูและเปิดใบเสร็จย้อนหลังได้เร็วขึ้น
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => loadOrderHistory(startDate, endDate)}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <RefreshCcw className={isLoading ? "animate-spin" : ""} />
                    Refresh History
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {error ? (
          <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-700">
            <AlertCircle className="size-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <Card className="rounded-lg border border-black/8 bg-white/88 py-0 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <CardContent className="px-4 py-4">
            <form
              onSubmit={handleFilter}
              className="grid gap-3 xl:grid-cols-[1fr_1fr_auto_auto]"
            >
              <div className="space-y-2">
                <Label htmlFor="history-start-date">Start Date</Label>
                <Input
                  id="history-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="history-end-date">End Date</Label>
                <Input
                  id="history-end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <Button type="submit" size="lg" className="self-end">
                <FileSearch />
                Filter
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleResetFilter}
                className="self-end"
              >
                Reset
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="space-y-3">
            <div className="h-16 animate-pulse rounded-lg border bg-black/5" />
            <div className="h-16 animate-pulse rounded-lg border bg-black/5" />
            <div className="h-16 animate-pulse rounded-lg border bg-black/5" />
          </div>
        ) : null}

        {!isLoading && orders.length === 0 ? (
          <DataTableShell
            title="Order History"
            description="ประวัติการขายย้อนหลังตามช่วงวันที่ที่เลือก"
          >
            <div className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-black/60">
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
              <div className="grid gap-3 2xl:hidden">
                {orders.map((order) => (
                  <Card
                    key={order.order_id}
                    className="rounded-lg border border-black/8 py-0 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
                  >
                    <CardContent className="px-4 py-4">
                      <p className="break-words text-sm font-medium text-black/80">
                        {order.order_id}
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-black/70">
                        <p>Seller: {order.seller_name}</p>
                        <p>Items: {order.item_count}</p>
                        <p>Total: {order.grand_total.toFixed(2)}</p>
                        <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleViewReceipt(order.order_id)}
                        disabled={isReceiptLoading}
                        className="mt-3"
                      >
                        <ReceiptText />
                        View Receipt
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Table className="hidden w-full min-w-[1040px] 2xl:table">
                <TableHeader className="bg-muted text-left">
                  <TableRow className="hover:bg-muted">
                    <TableHead className="w-[260px] px-4 py-3 font-medium text-muted-foreground">
                      Order ID
                    </TableHead>
                    <TableHead className="w-32 px-4 py-3 font-medium text-muted-foreground">
                      Seller
                    </TableHead>
                    <TableHead className="w-20 px-4 py-3 font-medium text-muted-foreground">
                      Items
                    </TableHead>
                    <TableHead className="w-28 px-4 py-3 font-medium text-muted-foreground">
                      Discount
                    </TableHead>
                    <TableHead className="w-24 px-4 py-3 font-medium text-muted-foreground">
                      VAT
                    </TableHead>
                    <TableHead className="w-32 px-4 py-3 font-medium text-muted-foreground">
                      Grand Total
                    </TableHead>
                    <TableHead className="w-32 px-4 py-3 font-medium text-muted-foreground">
                      Created At
                    </TableHead>
                    <TableHead className="w-40 px-4 py-3 font-medium text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.order_id}>
                      <TableCell className="max-w-[260px] whitespace-normal break-all px-4 py-3 font-medium leading-5">
                        {order.order_id}
                      </TableCell>
                      <TableCell className="max-w-[160px] truncate px-4 py-3">
                        {order.seller_name}
                      </TableCell>
                      <TableCell className="px-4 py-3">{order.item_count}</TableCell>
                      <TableCell className="px-4 py-3">
                        {order.total_discount.toFixed(2)}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {order.total_vat.toFixed(2)}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {order.grand_total.toFixed(2)}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReceipt(order.order_id)}
                          disabled={isReceiptLoading}
                        >
                          <ReceiptText />
                          View Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
