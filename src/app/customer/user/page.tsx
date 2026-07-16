"use client"

import React from "react"
import { colors } from "@/lib/colors"
import { useAuth } from "@/contexts/AuthContext"
import { getOrderHistory } from "@/app/actions/orders/get-order-history"

type OrderSummary = {
  orderId?: string
  totalPrice?: number
  orderStatus?: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [ordersCount, setOrdersCount] = React.useState(0)
  const [completedCount, setCompletedCount] = React.useState(0)

  React.useEffect(() => {
    const load = async () => {
      if (!user?.id) return
      try {
        const data = await getOrderHistory({ userId: user.id })
        const orders = Array.isArray(data?.orders) ? (data.orders as OrderSummary[]) : []
        setOrdersCount(orders.length)
        setCompletedCount(
          orders.filter((order) => order.orderStatus?.toLowerCase() === "delivered").length
        )
      } catch {
        setOrdersCount(0)
        setCompletedCount(0)
      }
    }

    load()
  }, [user?.id])

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-6" style={{ backgroundColor: colors.background.card, borderColor: colors.border.light }}>
        <h2 className="text-2xl font-semibold" style={{ color: colors.text.primary }}>
          {user?.name || user?.userName || "Customer"}
        </h2>
        <p className="mt-1 text-sm" style={{ color: colors.text.secondary }}>
          Manage your account information and review your purchase activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "User ID", value: user?.id || "Not available" },
          { label: "Email", value: user?.email || "Not available" },
          { label: "Role", value: user?.role || "customer" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border p-4" style={{ backgroundColor: colors.background.card, borderColor: colors.border.light }}>
            <p className="text-xs uppercase tracking-wide" style={{ color: colors.text.muted }}>{item.label}</p>
            <p className="mt-2 text-sm font-medium break-all" style={{ color: colors.text.primary }}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-4" style={{ backgroundColor: colors.background.card, borderColor: colors.border.light }}>
          <p className="text-xs uppercase tracking-wide" style={{ color: colors.text.muted }}>Orders Placed</p>
          <p className="mt-2 text-3xl font-semibold" style={{ color: colors.text.accent }}>{ordersCount}</p>
        </div>
        <div className="rounded-xl border p-4" style={{ backgroundColor: colors.background.card, borderColor: colors.border.light }}>
          <p className="text-xs uppercase tracking-wide" style={{ color: colors.text.muted }}>Delivered Orders</p>
          <p className="mt-2 text-3xl font-semibold" style={{ color: colors.text.accent }}>{completedCount}</p>
        </div>
      </div>
    </div>
  )
}
