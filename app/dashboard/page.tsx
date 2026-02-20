"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Dashboard() {
  const [todayTotal, setTodayTotal] = useState(0)
  const [allTimeTotal, setAllTimeTotal] = useState(0)
  const [vendorSummary, setVendorSummary] = useState<any[]>([])

  async function fetchDashboard() {
    const today = new Date().toISOString().split("T")[0]

    // Total Today
    const { data: todayData } = await supabase
      .from("orders")
      .select("total_amount")
      .gte("order_date", today)

    const todaySum =
      todayData?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0

    setTodayTotal(todaySum)

    // Total All Time
    const { data: allData } = await supabase
      .from("orders")
      .select("total_amount")

    const allSum =
      allData?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0

    setAllTimeTotal(allSum)

    // Vendor Summary Today
    const { data: vendorData } = await supabase
      .from("orders")
      .select(`
        total_amount,
        vendors (
          name
        )
      `)
      .gte("order_date", today)

    const grouped: any = {}

    vendorData?.forEach((o) => {
      const name = o.vendors?.name || "Unknown"
      grouped[name] = (grouped[name] || 0) + Number(o.total_amount)
    })

    const summary = Object.entries(grouped).map(([name, total]) => ({
      name,
      total
    }))

    setVendorSummary(summary)
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-2xl font-bold mb-6">Daily Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Today Sales</h2>
          <p className="text-2xl font-bold">RM {todayTotal}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Total Sales (All Time)</h2>
          <p className="text-2xl font-bold">RM {allTimeTotal}</p>
        </div>
      </div>

      {/* Vendor Summary */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Today Sales by Vendor</h2>

        {vendorSummary.length === 0 && (
          <p className="text-gray-500">No sales today.</p>
        )}

        {vendorSummary.map((v, index) => (
          <div key={index} className="border-b py-2">
            <p className="font-semibold">{v.name}</p>
            <p className="text-sm">RM {v.total}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
