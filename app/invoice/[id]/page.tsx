"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "../../../lib/supabase"

export default function InvoicePage() {
  const { id } = useParams()
  const [invoice, setInvoice] = useState<any>(null)

  async function fetchInvoice() {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        vendors (
          name,
          phone,
          address
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.log(error)
      return
    }

    setInvoice(data)
  }

  useEffect(() => {
    if (id) fetchInvoice()
  }, [id])

  if (!invoice) return <div className="p-10">Loading...</div>

  return (
    <div className="p-10 bg-white min-h-screen print:p-0">
      <div className="max-w-3xl mx-auto border p-8 shadow print:shadow-none">

        <h1 className="text-3xl font-bold mb-6">INVOICE</h1>

        <div className="mb-6">
          <p><strong>Invoice No:</strong> {invoice.invoice_no}</p>
          <p><strong>Date:</strong> {new Date(invoice.order_date).toLocaleDateString()}</p>
        </div>

        <div className="mb-6">
          <p className="font-semibold">Bill To:</p>
          <p>{invoice.vendors?.name}</p>
          <p>{invoice.vendors?.phone}</p>
          <p>{invoice.vendors?.address}</p>
        </div>

        <div className="border-t border-b py-4 mb-6">
          <div className="flex justify-between">
            <span>{invoice.kg} KG × RM {invoice.price_per_kg}</span>
            <span>RM {invoice.total_amount}</span>
          </div>
        </div>

        <div className="text-right text-xl font-bold">
          Total: RM {invoice.total_amount}
        </div>

        <div className="mt-10 print:hidden">
          <button
            onClick={() => window.print()}
            className="bg-black text-white px-6 py-2 rounded"
          >
            Print / Save PDF
          </button>
        </div>

      </div>
    </div>
  )
}
