"use client"

import React from "react"
import { colors } from "@/lib/colors"
import { useAuth } from "@/contexts/AuthContext"
import { getOrderHistory } from "@/app/actions/orders/get-order-history"

type OrderHistoryItem = {
  orderId?: string
  orderItemName?: string
  quantity?: number
  totalPrice?: number
  orderStatus?: string
  orderDate?: string
}

export default function OrderDetailsSlot() {
  const { user } = useAuth()
  const [orders, setOrders] = React.useState<OrderHistoryItem[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const load = async () => {
      if (!user?.id) {
        setOrders([])
        setLoading(false)
        return
      }

      try {
        const data = await getOrderHistory({ userId: user.id })
        setOrders(Array.isArray(data?.orders) ? (data.orders as OrderHistoryItem[]) : [])
      } catch {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user?.id])

  if (loading) {
    return <p style={{ color: colors.text.secondary }}>Loading recent order details...</p>
  }

  if (orders.length === 0) {
    return <p style={{ color: colors.text.secondary }}>No order details available yet.</p>
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold" style={{ color: colors.text.primary }}>Recent Order Details</h3>
      {orders.slice(0, 5).map((order) => (
        <div key={order.orderId} className="rounded-xl border p-4" style={{ backgroundColor: colors.background.card, borderColor: colors.border.light }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium" style={{ color: colors.text.primary }}>{order.orderItemName ?? "Order"}</p>
              <p className="mt-1 text-sm" style={{ color: colors.text.secondary }}>
                Quantity: {order.quantity ?? 0} · Total: ₹{Number(order.totalPrice ?? 0).toLocaleString()}
              </p>
            </div>
            <span className="rounded-full px-2 py-1 text-xs font-medium capitalize" style={{ backgroundColor: colors.background.muted, color: colors.text.accent }}>
              {order.orderStatus ?? "pending"}
            </span>
          </div>
          <p className="mt-2 text-xs" style={{ color: colors.text.muted }}>
            {order.orderDate ? new Date(order.orderDate).toLocaleString() : "Date unavailable"}
          </p>
        </div>
      ))}
    </div>
  )
}
