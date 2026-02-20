"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Vendors() {
  const [vendors, setVendors] = useState<any[]>([])
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")

  async function fetchVendors() {
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error) setVendors(data || [])
  }

  async function addVendor() {
    if (!name) return alert("Vendor name required")

    const { error } = await supabase.from("vendors").insert([
      {
        name,
        phone,
        address
      }
    ])

    if (error) {
      alert(error.message)
      return
    }

    setName("")
    setPhone("")
    setAddress("")
    fetchVendors()
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-2xl font-bold mb-6">Vendor Management</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            className="border p-2"
            placeholder="Vendor Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border p-2"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <textarea
          className="border p-2 w-full mt-4"
          placeholder="Vendor Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button
          onClick={addVendor}
          className="mt-4 bg-black text-white px-4 py-2 rounded"
        >
          Add Vendor
        </button>
      </div>

      {/* LIST */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Vendor List</h2>

        {vendors.length === 0 && (
          <p className="text-gray-500">No vendors yet.</p>
        )}

        {vendors.map((v) => (
          <div key={v.id} className="border-b py-3">
            <p className="font-semibold">{v.name}</p>
            <p className="text-sm text-gray-500">{v.phone}</p>
            <p className="text-sm text-gray-500">{v.address}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
