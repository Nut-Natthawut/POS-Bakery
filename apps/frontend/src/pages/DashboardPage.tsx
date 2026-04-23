import { useEffect, useState } from "react"
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
      <div>
        <p className="text-sm font-medium text-black/45">Overview</p>
        <h1 className="text-2xl font-semibold text-[#1d1d1f]">Dashboard</h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-black/55">
          ภาพรวมยอดขายของเดือนปัจจุบันและ 5 อันดับเมนูขายดี
        </p>
      </div>

      {error ? (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
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
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead className="bg-black/5 text-left">
                    <tr>
                      <th className="px-4 py-3">Rank</th>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Total Quantity</th>
                    </tr>
                  </thead>

                  <tbody>
                    {summary.best_sellers.map((item, index) => (
                      <tr key={item.product_id} className="border-t">
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3">{item.product_name}</td>
                        <td className="px-4 py-3">{item.total_quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DataTableShell>
        </>
      ) : null}
    </section>
  )
}
