"use client"

import React from "react"
import { getLatestOrders } from "@/app/actions/orders/get-latest-orders"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<LatestOrder[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await getLatestOrders(25)
        setOrders(Array.isArray(result) ? (result as LatestOrder[]) : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <Card className="border-blue-200 bg-white/90">
      <CardHeader>
        <CardTitle className="text-2xl">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <p className="text-sm text-blue-700/70">Loading orders...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Placed</TableHead>
                <TableHead>Delivered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>{order.orderItemName}</TableCell>
                  <TableCell>{order.orderName}</TableCell>
                  <TableCell className="capitalize">{order.orderStatus}</TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>{formatDate(order.deliveryDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
