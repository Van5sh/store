"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUsers } from "@/app/actions/users/get-users"
import { getLatestOrders } from "@/app/actions/orders/get-latest-orders"
import { getStores } from "@/app/actions/store/actions"
import { getAllProducts, type ProductItem } from "@/app/actions/product/get-products"

type UserRow = {
  userid: string
  role: string
}

type LatestOrder = {
  orderId: string
  orderStatus: string
}

const CATEGORY_LABELS: Record<string, string> = {
  electronics: "Electronics",
  clothing: "Clothing",
  home_appliances: "Home Appliances",
  books: "Books",
  toys: "Toys",
  sports: "Sports",
}

export default function AnalyticsPage() {
  const [users, setUsers] = React.useState<UserRow[]>([])
  const [orders, setOrders] = React.useState<LatestOrder[]>([])
  const [storesCount, setStoresCount] = React.useState(0)
  const [products, setProducts] = React.useState<ProductItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        const [userResponse, latestOrders, stores, allProducts] = await Promise.all([
          getUsers({ page: 1, limit: 100 }),
          getLatestOrders(100),
          getStores(),
          getAllProducts(),
        ])

        setUsers(Array.isArray(userResponse?.data) ? (userResponse.data as UserRow[]) : [])
        setOrders(Array.isArray(latestOrders) ? (latestOrders as LatestOrder[]) : [])
        setStoresCount(stores.length)
        setProducts(allProducts)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const roleCounts = users.reduce<Record<string, number>>((acc, user) => {
    acc[user.role] = (acc[user.role] ?? 0) + 1
    return acc
  }, {})

  const statusCounts = orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.orderStatus] = (acc[order.orderStatus] ?? 0) + 1
    return acc
  }, {})

  const categoryCounts = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="mt-1 text-sm text-blue-700/70">
          Catalog, account, and order distribution based on live backend data.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Users", value: users.length },
          { label: "Stores", value: storesCount },
          { label: "Products", value: products.length },
          { label: "Tracked Orders", value: orders.length },
        ].map((item) => (
          <Card key={item.label} className="border-blue-200 bg-white/90">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-900/70">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-blue-950">
                {loading ? "..." : item.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="border-blue-200 bg-white/90">
          <CardHeader>
            <CardTitle>User Roles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(roleCounts).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between text-sm">
                <span className="capitalize">{role}</span>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-800">
                  {count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-white/90">
          <CardHeader>
            <CardTitle>Order Statuses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="capitalize">{status}</span>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-800">
                  {count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-white/90">
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between text-sm">
                <span>{CATEGORY_LABELS[category] ?? category}</span>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-800">
                  {count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
