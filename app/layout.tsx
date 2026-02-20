import "./globals.css"
import Link from "next/link"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <div className="flex min-h-screen">

          {/* Sidebar */}
          <aside className="w-64 bg-green-700 text-white p-6 hidden md:block">
            <h1 className="text-2xl font-bold mb-8">
              Kudin Santan Admin
            </h1>

            <nav className="space-y-4 text-lg">
              <Link
                href="/dashboard"
                className="block px-3 py-2 rounded hover:bg-green-600 transition"
              >
                📊 Dashboard
              </Link>

              <Link
                href="/vendors"
                className="block px-3 py-2 rounded hover:bg-green-600 transition"
              >
                🧑‍🌾 Vendors
              </Link>

              <Link
                href="/orders"
                className="block px-3 py-2 rounded hover:bg-green-600 transition"
              >
                🧾 Orders
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 md:p-10">
            
            {/* Top Header */}
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                Admin Panel
              </h2>

              <div className="text-sm text-gray-500">
                Kudin Empire System
              </div>
            </div>

            {children}

          </main>

        </div>
      </body>
    </html>
  )
}