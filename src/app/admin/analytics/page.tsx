export default function AnalyticsPage() {
  const stats = [
    { label: "Total Revenue", value: "$124,540", delta: "+12.4%" },
    { label: "Orders", value: "1,482", delta: "+6.1%" },
    { label: "New Customers", value: "326", delta: "+4.8%" },
    { label: "Avg. Order Value", value: "$84.02", delta: "+2.2%" },
  ];

  const topProducts = [
    { name: "Classic Hoodie", units: 412, revenue: "$24,720" },
    { name: "Canvas Sneakers", units: 318, revenue: "$19,080" },
    { name: "Everyday Tote", units: 277, revenue: "$11,910" },
    { name: "Denim Jacket", units: 194, revenue: "$18,430" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-blue-700/70">
          Overview of performance and trends for the last 30 days.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-blue-200 bg-[#F2F4F7]/70 p-4 shadow-sm"
          >
            <p className="text-xs uppercase tracking-wide text-blue-700/70">
              {stat.label}
            </p>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-2xl font-semibold text-blue-900">{stat.value}</p>
              <span className="text-xs font-medium text-emerald-600">
                {stat.delta}
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-blue-200 bg-[#F2F4F7]/70 p-4 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-blue-900">
            Revenue Breakdown
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-md bg-blue-50 p-3">
              <p className="text-xs text-blue-700/70">Online Store</p>
              <p className="text-lg font-semibold text-blue-900">$72,300</p>
              <p className="text-xs text-blue-700/70">+9.3%</p>
            </div>
            <div className="rounded-md bg-blue-50 p-3">
              <p className="text-xs text-blue-700/70">Marketplace</p>
              <p className="text-lg font-semibold text-blue-900">$31,180</p>
              <p className="text-xs text-blue-700/70">+4.7%</p>
            </div>
            <div className="rounded-md bg-blue-50 p-3">
              <p className="text-xs text-blue-700/70">Wholesale</p>
              <p className="text-lg font-semibold text-blue-900">$21,060</p>
              <p className="text-xs text-blue-700/70">+2.9%</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-blue-200 bg-[#F2F4F7]/70 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-blue-900">Top Products</h2>
          <ul className="mt-4 space-y-3 text-sm text-blue-900">
            {topProducts.map((product) => (
              <li
                key={product.name}
                className="flex items-center justify-between border-b border-blue-100 pb-2 last:border-b-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-blue-700/70">
                    {product.units} units
                  </p>
                </div>
                <span className="text-xs font-semibold">{product.revenue}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
