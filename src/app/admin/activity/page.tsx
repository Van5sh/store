"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUsers } from "@/app/actions/users/get-users"
import { getLatestOrders } from "@/app/actions/orders/get-latest-orders"
import { getStores } from "@/app/actions/store/actions"
import { getAllProducts, type ProductItem } from "@/app/actions/product/get-products"

type ActivityItem = {
  id: string
  kind: string
  message: string
  timestamp: string
}

type UserRow = {
  userid: string
  name: string | null
  role: string
  createdAt?: string
}

type StoreRow = {
  storeId: string
  storeName: string
  cityName: string
}

type LatestOrder = {
  orderId: string
  orderDate: string
  orderStatus: string
  orderItemName: string
  orderName: string
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

export default function AdminActivityPage() {
  const [items, setItems] = React.useState<ActivityItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        const [userResponse, latestOrders, stores, products] = await Promise.all([
          getUsers({ page: 1, limit: 20 }),
          getLatestOrders(15),
          getStores(),
          getAllProducts(),
        ])

        const nextItems: ActivityItem[] = []

        for (const user of (userResponse?.data ?? []) as UserRow[]) {
          if (!user.createdAt) continue
          nextItems.push({
            id: `user-${user.userid}`,
            kind: "user",
            message: `${user.name || "Unnamed user"} joined as ${user.role}`,
            timestamp: user.createdAt,
          })
        }

        for (const order of (latestOrders ?? []) as LatestOrder[]) {
          nextItems.push({
            id: `order-${order.orderId}`,
            kind: "order",
            message: `Order for ${order.orderItemName} is ${order.orderStatus} in ${order.orderName}`,
            timestamp: order.orderDate,
          })
        }

        for (const store of stores as StoreRow[]) {
          nextItems.push({
            id: `store-${store.storeId}`,
            kind: "store",
            message: `Store ${store.storeName} is active in ${store.cityName}`,
            timestamp: new Date().toISOString(),
          })
        }

        for (const product of (products ?? []) as ProductItem[]) {
          nextItems.push({
            id: `product-${product.productId}`,
            kind: "product",
            message: `Catalog includes ${product.productName} in ${product.category}`,
            timestamp: new Date().toISOString(),
          })
        }

        setItems(
          nextItems
            .sort(
              (a, b) =>
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            )
            .slice(0, 25)
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load activity")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <Card className="border-blue-200 bg-white/90">
      <CardHeader>
        <CardTitle className="text-2xl">Operational Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <p className="text-sm text-blue-700/70">Loading activity...</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium capitalize text-blue-950">
                      {item.kind}
                    </p>
                    <p className="text-sm text-blue-800/80">{item.message}</p>
                  </div>
                  <span className="text-xs text-blue-700/70">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
