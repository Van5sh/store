"use client"

import React from "react"
import { getLatestOrders } from "@/app/actions/orders/get-latest-orders"
import {
  getRecentActivity,
  type RecentActivityItem,
} from "@/app/actions/activity/get-recent-activity"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BadgeIndianRupee, ClipboardList, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

type LatestOrder = {
  orderId: string
  orderDate: string
  orderStatus: string
  deliveryDate: string | null
  orderItemName: string
  orderName: string
}

function formatDate(value: string | null) {
  if (!value) return "Pending"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

function statusClasses(status: string) {
  if (status === "delivered") return "bg-emerald-50 text-emerald-700"
  if (status === "shipped") return "bg-blue-50 text-blue-700"
  if (status === "cancelled") return "bg-red-50 text-red-700"
  return "bg-amber-50 text-amber-700"
}

export default function VendorOrdersPage() {
  const [orders, setOrders] = React.useState<LatestOrder[]>([])
  const [orderActivities, setOrderActivities] = React.useState<RecentActivityItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [latestOrders, activityResponse] = await Promise.all([
        getLatestOrders(20),
        getRecentActivity({ limit: 30 }),
      ])

      setOrders(Array.isArray(latestOrders) ? (latestOrders as LatestOrder[]) : [])
      setOrderActivities(
        (activityResponse.activities ?? []).filter((activity) =>
          activity.type.includes("order")
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    load()
  }, [load])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Orders
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Track recent order flow and vendor-facing order activity.
          </p>
        </div>
        <Button variant="outline" onClick={load} disabled={loading}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ClipboardList className="h-5 w-5" />
              Latest Order Stream
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading && orders.length === 0 ? (
              <p className="text-sm text-slate-500">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-sm text-slate-500">No orders available.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:bg-slate-900/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-50">
                          {order.orderItemName}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-300">
                          {order.orderName}
                        </p>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">
                          Ordered: {formatDate(order.orderDate)}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses(order.orderStatus)}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">
                      Delivery: {formatDate(order.deliveryDate)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BadgeIndianRupee className="h-5 w-5" />
              Your Order Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading && orderActivities.length === 0 ? (
              <p className="text-sm text-slate-500">Loading activity...</p>
            ) : orderActivities.length === 0 ? (
              <p className="text-sm text-slate-500">
                No vendor order activity found yet.
              </p>
            ) : (
              <div className="space-y-3">
                {orderActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:bg-slate-900/30"
                  >
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                      {activity.message}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                      {formatDate(activity.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
