"use client"
import React from "react"
import { colors } from "@/lib/colors"
import { PackageSearch, Package, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react"

interface Order {
    orderId: string,
    orderDate: string,
    orderStatus: string,
    deliveryDate: null,
    orderItemName: string,
    orderName: string
}

const statusConfig: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
    delivered:  { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0", icon: <CheckCircle2 size={13} /> },
    pending:    { bg: colors.amber[50], text: colors.amber[700], border: colors.border.light, icon: <Clock size={13} /> },
    cancelled:  { bg: "#fef2f2", text: "#dc2626", border: "#fecaca", icon: <XCircle size={13} /> },
    processing: { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe", icon: <Loader2 size={13} /> },
}

const getStatusStyle = (status: string) => {
    const key = status?.toLowerCase() ?? ""
    return statusConfig[key] ?? { bg: colors.amber[50], text: colors.amber[700], border: colors.border.light, icon: <Clock size={13} /> }
}

const HistoryPage = () => {
    const [orders, setOrders] = React.useState<Order[]>([])
    React.useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch("/api/orders/latest")
                const contentType = res.headers.get("content-type") ?? ""
                const data = contentType.includes("application/json")
                    ? await res.json()
                    : null
                if (!res.ok) {
                    const fallback = contentType.includes("text")
                        ? await res.text()
                        : ""
                    const message =
                        data?.message ??
                        (fallback ? fallback.slice(0, 200) : "") ??
                        `Failed to fetch order history (status ${res.status})`
                    throw new Error(message)
                }
                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.orders)
                    ? data.orders
                    : []
                setOrders(list)
            } catch (err) {
                console.error("Failed to fetch order history:", err)
                setOrders([])
            }
        }
        fetchHistory()
    }, [])

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
                        Order History
                    </h1>
                    {orders.length > 0 && (
                        <p className="text-sm mt-0.5" style={{ color: colors.text.secondary }}>
                            {orders.length} order{orders.length !== 1 ? "s" : ""} found
                        </p>
                    )}
                </div>
                <div
                    className="p-2.5 rounded-xl"
                    style={{ backgroundColor: colors.amber[50], border: `1px solid ${colors.border.light}` }}
                >
                    <Package size={20} style={{ color: colors.amber[600] }} />
                </div>
            </div>

            {/* Divider */}
            <div className="mb-6" style={{ height: "1px", backgroundColor: colors.border.light }} />

            {/* Empty state */}
            {orders.length === 0 ? (
                <div
                    className="flex flex-col items-center justify-center py-20 rounded-xl"
                    style={{ backgroundColor: colors.background.card, border: `1px dashed ${colors.border.light}` }}
                >
                    <div
                        className="p-4 rounded-full mb-4"
                        style={{ backgroundColor: colors.amber[50] }}
                    >
                        <PackageSearch size={32} style={{ color: colors.amber[600] }} className="opacity-60" />
                    </div>
                    <p className="text-base font-semibold mb-1" style={{ color: colors.text.primary }}>No orders yet</p>
                    <p className="text-sm" style={{ color: colors.text.secondary }}>Your order history will appear here.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map((order: any) => {
                        const status = order.orderStatus ?? "N/A"
                        const style = getStatusStyle(status)
                        return (
                            <div
                                key={order.orderId ?? order.id}
                                className="rounded-xl overflow-hidden"
                                style={{
                                    backgroundColor: colors.background.card,
                                    border: `1px solid ${colors.border.light}`,
                                }}

                            >
                                {/* Accent bar */}
                                <div className="h-1 w-full" style={{ backgroundColor: style.text + "33" }} />

                                <div className="p-5">
                                    {/* Top row */}
                                    <div className="flex items-center justify-between gap-3 mb-4">
                                        <div className="flex items-center gap-2.5">
                                            <div
                                                className="p-2 rounded-lg"
                                                style={{ backgroundColor: colors.amber[50], border: `1px solid ${colors.border.light}` }}
                                            >
                                                <Package size={15} style={{ color: colors.amber[600] }} />
                                            </div>
                                            <h2 className="text-sm font-semibold" style={{ color: colors.text.primary }}>
                                                Order #{order.orderId ?? order.id}
                                            </h2>
                                        </div>
                                        <span
                                            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full capitalize"
                                            style={{ backgroundColor: style.bg, color: style.text, border: `1px solid ${style.border}` }}
                                        >
                                            {style.icon}
                                            {status}
                                        </span>
                                    </div>

                                    {/* Divider */}
                                    <div className="mb-3" style={{ height: "1px", backgroundColor: colors.border.light }} />

                                    {/* Info grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div
                                            className="rounded-lg px-3 py-2.5"
                                            style={{ backgroundColor: colors.amber[50] + "80", border: `1px solid ${colors.border.light}` }}
                                        >
                                            <p className="text-xs font-medium mb-0.5" style={{ color: colors.text.secondary }}>Item</p>
                                            <p className="text-sm font-semibold truncate" style={{ color: colors.text.primary }}>
                                                {order.orderItemName ?? order.productName ?? "N/A"}
                                            </p>
                                        </div>
                                        <div
                                            className="rounded-lg px-3 py-2.5"
                                            style={{ backgroundColor: colors.amber[50] + "80", border: `1px solid ${colors.border.light}` }}
                                        >
                                            <p className="text-xs font-medium mb-0.5" style={{ color: colors.text.secondary }}>Ordered</p>
                                            <p className="text-sm font-semibold" style={{ color: colors.text.primary }}>
                                                {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default HistoryPage