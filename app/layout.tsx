"use client"

import "./globals.css"
import Link from "next/link"
import { useState } from "react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [open, setOpen] = useState(false)

  return (
    <html lang="en">
      <body className="bg-white text-black">

        <div className="flex min-h-screen">

          {/* ===== MOBILE OVERLAY ===== */}
          {open && (
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setOpen(false)}
            />
          )}

          {/* ===== SIDEBAR ===== */}
          <aside
            className={`
              fixed md:static z-50
              w-64 bg-green-700 text-white p-6
              min-h-screen
              transform transition-transform duration-300
              ${open ? "translate-x-0" : "-translate-x-full"}
              md:translate-x-0
            `}
          >
            <h1 className="text-2xl font-bold mb-8 text-white">
              Kudin Santan
            </h1>

            <nav className="space-y-4 text-lg">
              <Link
                href="/dashboard"
                className="block px-3 py-2 rounded hover:bg-green-600"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                href="/vendors"
                className="block px-3 py-2 rounded hover:bg-green-600"
                onClick={() => setOpen(false)}
              >
                Vendors
              </Link>

              <Link
                href="/orders"
                className="block px-3 py-2 rounded hover:bg-green-600"
                onClick={() => setOpen(false)}
              >
                Orders
              </Link>
            </nav>
          </aside>

          {/* ===== MAIN ===== */}
          <main className="flex-1 md:ml-64 bg-white">

            {/* ===== MOBILE HEADER ===== */}
            <div className="md:hidden flex items-center justify-between bg-white border-b p-4 shadow-sm">
              <button
                onClick={() => setOpen(true)}
                className="text-3xl font-bold text-black"
              >
                ☰
              </button>

              <span className="font-bold text-black">
                Kudin Empire
              </span>
            </div>

            {/* ===== DESKTOP HEADER ===== */}
            <div className="hidden md:flex justify-between items-center p-8 border-b bg-white">
              <h2 className="text-2xl font-bold text-black">
                Admin Panel
              </h2>

              <div className="text-sm text-gray-600">
                Kudin Empire System
              </div>
            </div>

            <div className="p-4 md:p-8 text-black">
              {children}
            </div>

          </main>
        </div>

      </body>
    </html>
  )
}