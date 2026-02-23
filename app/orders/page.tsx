"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import jsPDF from "jspdf"

export default function Orders() {
  const [vendors, setVendors] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [vendorId, setVendorId] = useState("")
  const [product, setProduct] = useState("Santan")
  const [kg, setKg] = useState("")
  const [price, setPrice] = useState("")
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  )

  async function fetchVendors() {
    const { data } = await supabase
      .from("vendors")
      .select("id, name")

    if (data && data.length > 0) {
      setVendors(data)
      setVendorId(data[0].id)
    }
  }

  async function fetchOrders(date: string) {
    const start = new Date(date + "T00:00:00")
    const end = new Date(date + "T23:59:59")

    const { data } = await supabase
      .from("orders")
      .select(`
        id,
        invoice_no,
        product,
        kg,
        price_per_kg,
        total_amount,
        status,
        created_at,
        vendors ( name )
      `)
      .gte("created_at", start.toISOString())
      .lte("created_at", end.toISOString())
      .order("created_at", { ascending: false })

    setOrders(data || [])
  }

  function generateInvoicePDF(order: any) {
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text("KUDIN SANTAN", 20, 20)
    doc.setFontSize(11)
    doc.text("Phone: 011-26488060", 20, 28)

    doc.setFontSize(12)
    doc.text(`Invoice No: ${order.invoice_no}`, 20, 45)
    doc.text(
      `Date: ${new Date(order.created_at).toLocaleString()}`,
      20,
      52
    )

    doc.text(`Bill To: ${order.vendors?.name}`, 20, 65)

    doc.line(20, 75, 190, 75)

    doc.text("Product", 20, 85)
    doc.text("KG", 110, 85)
    doc.text("Price", 135, 85)
    doc.text("Total", 165, 85)

    doc.line(20, 88, 190, 88)

    doc.text(order.product, 20, 100)
    doc.text(String(order.kg), 110, 100)
    doc.text(`RM ${order.price_per_kg}`, 135, 100)
    doc.text(`RM ${order.total_amount}`, 165, 100)

    doc.line(20, 110, 190, 110)

    doc.setFontSize(14)
    doc.text(`Grand Total: RM ${order.total_amount}`, 20, 125)

    doc.setFontSize(11)
    doc.text("Bank: Maybank", 20, 150)
    doc.text("Acc: 564128636944", 20, 157)
    doc.text("Name: Zaidicocos Enterprise", 20, 164)

    doc.save(`${order.invoice_no}.pdf`)
  }

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

    const newOrder = {
      vendor_id: vendorId,
      product,
      kg: Number(kg),
      price_per_kg: Number(price),
      total_amount: total,
      invoice_no: invoiceNo,
      status: "pending",
      created_at: new Date().toISOString(),
      vendors: vendors.find(v => v.id === vendorId)
    }

    await supabase.from("orders").insert([newOrder])
    generateInvoicePDF(newOrder)

    setKg("")
    setPrice("")
    fetchOrders(selectedDate)
  }

  async function updateStatus(id: string, newStatus: string) {
    await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id)

    fetchOrders(selectedDate)
  }

  useEffect(() => {
    fetchVendors()
    fetchOrders(selectedDate)
  }, [selectedDate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-4 md:p-10">

      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Order Management
      </h1>

      {/* DATE FILTER */}
      <div className="mb-6">
        <label className="font-semibold text-gray-600 mr-2">
          View Date:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded-lg shadow-sm"
        />
      </div>

      {/* FORM CARD */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg mb-6">

        <select
          className="border p-3 rounded-xl w-full mb-4"
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
        >
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>

        <select
          className="border p-3 rounded-xl w-full mb-4"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        >
          <option value="Santan">Santan</option>
          <option value="Kelapa Parut">Kelapa Parut</option>
        </select>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            className="border p-3 rounded-xl"
            placeholder="KG"
            value={kg}
            onChange={(e) => setKg(e.target.value)}
          />
          <input
            type="number"
            className="border p-3 rounded-xl"
            placeholder="Price per KG"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <button
          onClick={addOrder}
          className="mt-4 w-full bg-green-600 hover:bg-green-700 transition text-white py-3 rounded-xl text-lg font-semibold"
        >
          Add Order & Print Invoice
        </button>
      </div>

      {/* ORDER HISTORY */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg">
        <h2 className="font-semibold text-lg mb-4 text-gray-700">
          Order History ({selectedDate})
        </h2>

        {orders.length === 0 && (
          <p className="text-gray-400">
            No orders for this date.
          </p>
        )}

        {orders.map((o) => (
          <div
            key={o.id}
            className="bg-gray-50 p-4 rounded-xl mb-4 shadow-sm"
          >
            <p className="font-semibold text-lg text-gray-800">
              {o.vendors?.name}
            </p>

            <p className="text-sm text-gray-500">
              {o.product}
            </p>

            <p className="text-sm text-gray-600">
              {o.kg} KG × RM{o.price_per_kg}
            </p>

            <p className="font-bold text-green-700 mt-1">
              RM{o.total_amount}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">

              <button
                onClick={() => generateInvoicePDF(o)}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
              >
                Invoice
              </button>

              {o.status === "pending" && (
                <>
                  <button
                    onClick={() => updateStatus(o.id, "paid")}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm"
                  >
                    Paid
                  </button>

                  <button
                    onClick={() => updateStatus(o.id, "cancelled")}
                    className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </>
              )}

              {o.status === "paid" && (
                <span className="text-green-600 font-semibold">
                  Paid
                </span>
              )}

              {o.status === "cancelled" && (
                <span className="text-red-600 font-semibold">
                  Cancelled
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}