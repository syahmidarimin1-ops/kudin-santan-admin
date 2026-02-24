"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

export default function Dashboard() {
  const [orders, setOrders] = useState<any[]>([])
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  )

  const supabase =
    typeof window !== "undefined"
      ? createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
      : null

  async function fetchOrders() {
    if (!supabase) return

    const { data } = await supabase
      .from("orders")
      .select("*")

    setOrders(data || [])
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // ================= DAILY =================

  const today = new Date().toISOString().split("T")[0]

  const todayOrders = orders.filter(o =>
    o.created_at?.startsWith(today)
  )

  const paidToday = todayOrders.filter(o => o.status === "paid")
  const pendingToday = todayOrders.filter(o => o.status === "pending")
  const cancelledToday = todayOrders.filter(o => o.status === "cancelled")

  const totalSalesToday = paidToday.reduce(
    (sum, o) => sum + Number(o.total_amount),
    0
  )

  // ================= MONTHLY =================

  const monthOrders = orders.filter(o =>
    o.created_at?.startsWith(selectedMonth)
  )

  const paidMonth = monthOrders.filter(o => o.status === "paid")
  const pendingMonth = monthOrders.filter(o => o.status === "pending")
  const cancelledMonth = monthOrders.filter(o => o.status === "cancelled")

  const totalSalesMonth = paidMonth.reduce(
    (sum, o) => sum + Number(o.total_amount),
    0
  )

  const santanMonthKg = paidMonth
    .filter(o => o.product === "Santan")
    .reduce((sum, o) => sum + Number(o.kg), 0)

  const kelapaMonthKg = paidMonth
    .filter(o => o.product === "Kelapa Parut")
    .reduce((sum, o) => sum + Number(o.kg), 0)

  const allTimePaid = orders.filter(o => o.status === "paid")

  const totalAllTimeSales = allTimePaid.reduce(
    (sum, o) => sum + Number(o.total_amount),
    0
  )

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-10">

      <h1 className="text-2xl md:text-3xl font-bold mb-8">
        Dashboard
      </h1>

      {/* ================= DAILY ================= */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-6">
          Today
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

          <div className="bg-white border rounded-2xl shadow p-6">
            <p className="font-medium">
              Sales Today
            </p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">
              RM {totalSalesToday}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl shadow p-6">
            <p className="font-medium">
              Pending
            </p>
            <h2 className="text-3xl font-bold text-yellow-600 mt-2">
              {pendingToday.length}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl shadow p-6">
            <p className="font-medium">
              Cancelled
            </p>
            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {cancelledToday.length}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl shadow p-6">
            <p className="font-medium">
              All Time Paid
            </p>
            <h2 className="text-3xl font-bold mt-2">
              RM {totalAllTimeSales}
            </h2>
          </div>

        </div>
      </div>

      {/* ================= MONTHLY ================= */}

      <div className="bg-white border rounded-2xl shadow p-6">

        <h2 className="text-xl font-bold mb-6">
          Monthly Report
        </h2>

        <div className="mb-8">
          <label className="mr-3 font-semibold">
            Select Month:
          </label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded-lg p-2"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

          <div className="bg-gray-50 border rounded-xl p-6">
            <p className="font-medium">
              Monthly Sales
            </p>
            <h2 className="text-2xl font-bold text-green-600 mt-2">
              RM {totalSalesMonth}
            </h2>
          </div>

          <div className="bg-gray-50 border rounded-xl p-6">
            <p className="font-medium">
              Santan Sold
            </p>
            <h2 className="text-2xl font-bold mt-2">
              {santanMonthKg} KG
            </h2>
          </div>

          <div className="bg-gray-50 border rounded-xl p-6">
            <p className="font-medium">
              Kelapa Parut Sold
            </p>
            <h2 className="text-2xl font-bold mt-2">
              {kelapaMonthKg} KG
            </h2>
          </div>

          <div className="bg-gray-50 border rounded-xl p-6">
            <p className="font-medium">
              Pending (Month)
            </p>
            <h2 className="text-2xl font-bold text-yellow-600 mt-2">
              {pendingMonth.length}
            </h2>
          </div>

        </div>

        <div className="mt-6 text-red-600 font-semibold">
          Cancelled (Month): {cancelledMonth.length}
        </div>

      </div>

    </div>
  )
}