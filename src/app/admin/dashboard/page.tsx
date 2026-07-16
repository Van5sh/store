"use client"

import React from "react"
import { Users, ShoppingCart, Store, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getUsers } from "@/app/actions/users/get-users"
import { getLatestOrders } from "@/app/actions/orders/get-latest-orders"
import { getStores } from "@/app/actions/store/actions"
import { getAllProducts, type ProductItem } from "@/app/actions/product/get-products"

type UserRow = {
  userid: string
  name: string | null
  email: string
  role: string
  createdAt?: string
}

type LatestOrder = {
  orderId: string
  orderDate: string
  orderStatus: string
  deliveryDate: string | null
  orderItemName: string
  orderName: string
}

function formatDate(value?: string | null) {
  if (!value) return "N/A"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

export default function DashboardPage() {
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
          getUsers({ page: 1, limit: 25 }),
          getLatestOrders(8),
          getStores(),
          getAllProducts(),
        ])

        const userList = Array.isArray(userResponse?.data)
          ? (userResponse.data as UserRow[])
          : []

        setUsers(
          [...userList].sort((a, b) => {
            const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
            return bTime - aTime
          })
        )
        setOrders(Array.isArray(latestOrders) ? (latestOrders as LatestOrder[]) : [])
        setStoresCount(stores.length)
        setProducts(allProducts)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const vendorCount = users.filter((user) => user.role === "vendor").length

  const stats = [
    { label: "Users", value: users.length, icon: Users },
    { label: "Stores", value: storesCount, icon: Store },
    { label: "Products", value: products.length, icon: Package },
    { label: "Vendors", value: vendorCount, icon: ShoppingCart },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-blue-700/70">
          Live overview of users, commerce activity, and catalog coverage.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-blue-200 bg-white/90">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900/70">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-blue-700" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-blue-950">
                {loading ? "..." : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Card className="border-blue-200 bg-white/90">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-blue-700/70">Loading users...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.slice(0, 8).map((user) => (
                    <TableRow key={user.userid}>
                      <TableCell>{user.name || "Unnamed"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-white/90">
          <CardHeader>
            <CardTitle>Latest Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-blue-700/70">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-sm text-blue-700/70">No recent orders found.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-blue-950">
                          {order.orderItemName}
                        </p>
                        <p className="text-sm text-blue-700/70">{order.orderName}</p>
                      </div>
                      <span className="rounded-full bg-white px-2 py-1 text-xs font-medium capitalize text-blue-800">
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-blue-700/70">
                      {formatDate(order.orderDate)}
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
