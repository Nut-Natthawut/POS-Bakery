import { useEffect, useState } from "react"
import { AlertCircle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getDashboardSummary } from "../services/dashboardApi"
import type { DashboardSummary } from "../types/dashboard"
import { DataTableShell } from "../components/ui/DataTableShell"
import { StatCard } from "../components/ui/StatCard"

export const DashboardPage = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // โหลดข้อมูล dashboard จาก backend
  const loadDashboardSummary = async () => {
    try {
      setIsLoading(true)
      setError("")

      const result = await getDashboardSummary()
      setSummary(result.data)
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load dashboard",
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardSummary()
  }, [])

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-black/45">Overview</p>
          <h1 className="text-2xl font-semibold tracking-normal text-[#1d1d1f]">
            Dashboard
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-black/55">
            ภาพรวมยอดขายของเดือนปัจจุบันและ 5 อันดับเมนูขายดี
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={loadDashboardSummary}
          disabled={isLoading}
          className="w-full md:w-auto"
        >
          <RefreshCcw className={isLoading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-700">
          <AlertCircle className="size-4" />
          <AlertTitle>Failed to load dashboard</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-black/60">Loading dashboard...</p>
      ) : null}

      {summary ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
             <StatCard
              label="Revenue (This Month)"
              value={summary.revenue.toFixed(2)}
              helperText="ยอดขายรวมของเดือนปัจจุบัน"
            />

            <StatCard
              label="Total VAT (This Month)"
              value={summary.total_vat.toFixed(2)}
              helperText="ยอดภาษีที่เก็บได้จากการขาย"
            />
          </div>

           <DataTableShell
           title="Top 5 Best Sellers"
            description="เรียงตามจำนวนสินค้าที่ขายได้มากที่สุดในเดือนนี้"
          >
            {summary.best_sellers.length === 0 ? (
              <p className="text-sm text-black/60">No sales data this month</p>
            ) : (
              <Table>
                <TableHeader className="bg-black/4">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="px-4 py-3">Rank</TableHead>
                    <TableHead className="px-4 py-3">Product</TableHead>
                    <TableHead className="px-4 py-3">Total Quantity</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {summary.best_sellers.map((item, index) => (
                    <TableRow key={item.product_id}>
                      <TableCell className="px-4 py-3">{index + 1}</TableCell>
                      <TableCell className="px-4 py-3">{item.product_name}</TableCell>
                      <TableCell className="px-4 py-3">{item.total_quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </DataTableShell>
        </>
      ) : null}
    </section>
  )
}
