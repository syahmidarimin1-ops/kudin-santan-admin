"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Orders() {
  const [vendors, setVendors] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [vendorId, setVendorId] = useState("")
  const [kg, setKg] = useState("")
  const [price, setPrice] = useState("")

  // =========================
  // FETCH VENDORS
  // =========================
  async function fetchVendors() {
    const { data } = await supabase
      .from("vendors")
      .select("id, name")

    if (data && data.length > 0) {
      setVendors(data)
      setVendorId(data[0].id)
    }
  }

  // =========================
  // FETCH ORDERS
  // =========================
  async function fetchOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        invoice_no,
        kg,
        price_per_kg,
        total_amount,
        status,
        vendors (
          name
        )
      `)
      .order("created_at", { ascending: false })

    if (!error) {
      setOrders(data || [])
    } else {
      console.log(error)
    }
  }

  // =========================
  // ADD ORDER
  // =========================
  async function addOrder() {
    if (!vendorId || !kg || !price) {
      alert("Complete all fields")
      return
    }

    const total = Number(kg) * Number(price)

    const today = new Date()
    const datePart = today.toISOString().split("T")[0].replaceAll("-", "")

    const { data: existingOrders } = await supabase
      .from("orders")
      .select("id")
      .like("invoice_no", `INV-${datePart}%`)

    const runningNumber = (existingOrders?.length || 0) + 1
    const invoiceNo = `INV-${datePart}-${String(runningNumber).padStart(4, "0")}`

    const { error } = await supabase.from("orders").insert([
      {
        vendor_id: vendorId,
        kg: Number(kg),
        price_per_kg: Number(price),
        total_amount: total,
        invoice_no: invoiceNo,
        status: "pending"
      }
    ])

    if (!error) {
      setKg("")
      setPrice("")
      fetchOrders()
    } else {
      alert(error.message)
    }
  }

  // =========================
  // UPDATE STATUS
  // =========================
  async function updateStatus(id: string, newStatus: string) {
    await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id)

    fetchOrders()
  }

  useEffect(() => {
    fetchVendors()
    fetchOrders()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <select
          className="border p-2 w-full mb-4"
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
        >
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            className="border p-2"
            placeholder="KG"
            value={kg}
            onChange={(e) => setKg(e.target.value)}
          />
          <input
            type="number"
            className="border p-2"
            placeholder="Price per KG"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <button
          onClick={addOrder}
          className="mt-4 bg-black text-white px-4 py-2 rounded"
        >
          Add Order
        </button>
      </div>

      {/* ORDER LIST */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Order List</h2>

        {orders.length === 0 && (
          <p className="text-gray-500">No orders yet.</p>
        )}

        {orders.map((o) => (
          <div key={o.id} className="border-b py-4">
            <p className="font-semibold text-lg">
              {o.vendors?.name}
            </p>

            <p className="text-sm text-gray-500">
              {o.kg} KG × RM{o.price_per_kg}
            </p>

            <p className="font-semibold">
              Total: RM{o.total_amount}
            </p>

            <div className="mt-2">
              <select
                value={o.status}
                onChange={(e) =>
                  updateStatus(o.id, e.target.value)
                }
                className="border px-2 py-1 rounded"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}