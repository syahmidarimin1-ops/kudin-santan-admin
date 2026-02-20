export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6">
        KUDIN SANTAN – ADMIN DASHBOARD
      </h1>

      <div className="grid grid-cols-2 gap-6">

        <a
          href="/vendors"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">Vendors</h2>
          <p className="text-gray-500 mt-2">Manage vendor list</p>
        </a>

        <a
          href="/orders"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">Orders</h2>
          <p className="text-gray-500 mt-2">Create & manage orders</p>
        </a>

        <a
          href="/dashboard"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">Daily Summary</h2>
          <p className="text-gray-500 mt-2">Monitor collection & sales</p>
        </a>

      </div>
    </div>
  );
}
