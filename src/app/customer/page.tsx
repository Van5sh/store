"use client"

import React from "react"
import CarouselSize from "@/components/customer-ui/itemtype-carousel"
import { colors } from "@/lib/colors"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

const greeting = [
    "Hello, valued customer!",
    "Welcome! How can we help you today?",
    "We're here to assist you with anything you need."
];

interface Order {
    id: string;
    itemName: string;
    orderDate: string;
}

const CustomerPage = () => {
    const router = useRouter()
    const { user } = useAuth()
    const [randomGreeting, setRandomGreeting] = React.useState(greeting[0])
    const [orders, setOrders] = React.useState<Order[]>([])
    const [ordersLoading, setOrdersLoading] = React.useState(false)
    const [ordersError, setOrdersError] = React.useState<string | null>(null)

    const productItems = [
        { label: "Electronics", img: "💻", type:"electronics"},
        { label: "Clothing", img: "👕", type: "clothing" },
        { label: "Home & Garden", img: "🏡", type: "home-garden" },
        { label: "Sports", img: "⚽", type: "sports" },
        { label: "Books", img: "📚", type: "books" },
        { label: "Toys", img: "🎮", type: "toys" }
    ];

    React.useEffect(() => {
        const randomIndex = Math.floor(Math.random() * greeting.length)
        setRandomGreeting(greeting[randomIndex])
    }, [])

    React.useEffect(() => {
        let alive = true
        const fetchOrders = async () => {
            setOrdersLoading(true)
            setOrdersError(null)
            try {
                if (!user?.id) {
                    setOrders([])
                    setOrdersError("Please sign in to view your orders.")
                    return
                }
                const res = await fetch(
                    `/api/orders/history?userId=${encodeURIComponent(user.id)}&status=pending,shipped,delivered,cancelled`,
                    { method: "GET" }
                )
                const contentType = res.headers.get("content-type") ?? ""
                const data = contentType.includes("application/json")
                    ? await res.json()
                    : null
                if (!res.ok) {
                    throw new Error(
                        data?.message ?? "Failed to fetch orders"
                    )
                }

                const list = Array.isArray(data?.orders)
                    ? data.orders
                    : Array.isArray(data)
                    ? data
                    : []

                const mapped: Order[] = list.map((order: any) => ({
                    id: String(order.orderId ?? order.id ?? order._id),
                    itemName: order.orderItemName ?? order.itemName ?? "Order",
                    orderDate: order.orderDate ?? order.createdAt ?? "N/A",
                }))

                if (alive) {
                    setOrders(mapped.slice(0, 5))
                }
            } catch (err) {
                const message =
                    err instanceof Error ? err.message : "Failed to fetch orders"
                if (alive) {
                    setOrdersError(message)
                    setOrders([])
                }
            } finally {
                if (alive) {
                    setOrdersLoading(false)
                }
            }
        }

        fetchOrders()
        return () => {
            alive = false
        }
    }, [user?.id])

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ backgroundColor: colors.background.app }}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: colors.text.primary }}>{randomGreeting}</h1>
                    <p className="text-base sm:text-lg" style={{ color: colors.text.secondary }}>
                        This is the customer page where you can find various services tailored for you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: colors.background.card }}>
                            <h2 className="text-2xl font-semibold mb-4" style={{ color: colors.text.primary }}>Shop Here</h2>
                            <p className="mb-6" style={{ color: colors.text.secondary }}>
                                Find products and services that suit your needs. Browse through our extensive catalog and enjoy exclusive offers just for you.
                            </p>
                            <div className="relative px-12">
                                <CarouselSize Items={productItems} />
                            </div>
                        </div>

                        <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: colors.background.card }}>
                            <h2 className="text-2xl font-semibold mb-4" style={{ color: colors.text.primary }}>Quick Actions</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <button className="p-4 rounded-lg transition-colors" style={{ border: `1px solid ${colors.border.light}` }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = colors.amber[50];
                                    e.currentTarget.style.borderColor = colors.border.accent;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '';
                                    e.currentTarget.style.borderColor = colors.border.light;
                                  }}>
                                    <div className="text-3xl mb-2">📦</div>
                                    <p className="text-sm font-medium" style={{ color: colors.text.primary }}>Track Order</p>
                                </button>
                                <button className="p-4 rounded-lg transition-colors" style={{ border: `1px solid ${colors.border.light}` }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = colors.amber[50];
                                    e.currentTarget.style.borderColor = colors.border.accent;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '';
                                    e.currentTarget.style.borderColor = colors.border.light;
                                  }}>
                                    <div className="text-3xl mb-2">🔄</div>
                                    <p className="text-sm font-medium" style={{ color: colors.text.primary }}>Returns</p>
                                </button>
                                <button className="p-4 rounded-lg transition-colors" style={{ border: `1px solid ${colors.border.light}` }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = colors.amber[50];
                                    e.currentTarget.style.borderColor = colors.border.accent;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '';
                                    e.currentTarget.style.borderColor = colors.border.light;
                                  }}>
                                    <div className="text-3xl mb-2">💳</div>
                                    <p className="text-sm font-medium" style={{ color: colors.text.primary }}>Payment</p>
                                </button>
                                <button className="p-4 rounded-lg transition-colors" style={{ border: `1px solid ${colors.border.light}` }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = colors.amber[50];
                                    e.currentTarget.style.borderColor = colors.border.accent;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '';
                                    e.currentTarget.style.borderColor = colors.border.light;
                                  }}>
                                    <div className="text-3xl mb-2">💬</div>
                                    <p className="text-sm font-medium" style={{ color: colors.text.primary }}>Support</p>
                                </button>
                            </div>
                        </div>

                        <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: colors.background.card }}>
                            <h2 className="text-2xl font-semibold mb-4" style={{ color: colors.text.primary }}>Available Services</h2>
                            <div className="space-y-3">
                                <div className="p-4 rounded-lg cursor-pointer transition-colors" style={{ border: `1px solid ${colors.border.light}` }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = colors.border.accent;
                                    e.currentTarget.style.backgroundColor = colors.amber[50];
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = colors.border.light;
                                    e.currentTarget.style.backgroundColor = '';
                                  }}>
                                    <h3 className="font-semibold" style={{ color: colors.text.primary }}>Premium Support</h3>
                                    <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>Get 24/7 priority customer service</p>
                                </div>
                                <div className="p-4 rounded-lg cursor-pointer transition-colors" style={{ border: `1px solid ${colors.border.light}` }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = colors.border.accent;
                                    e.currentTarget.style.backgroundColor = colors.amber[50];
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = colors.border.light;
                                    e.currentTarget.style.backgroundColor = '';
                                  }}>
                                    <h3 className="font-semibold" style={{ color: colors.text.primary }}>Express Shipping</h3>
                                    <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>Upgrade to next-day delivery</p>
                                </div>
                                <div className="p-4 rounded-lg cursor-pointer transition-colors" style={{ border: `1px solid ${colors.border.light}` }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = colors.border.accent;
                                    e.currentTarget.style.backgroundColor = colors.amber[50];
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = colors.border.light;
                                    e.currentTarget.style.backgroundColor = '';
                                  }}>
                                    <h3 className="font-semibold" style={{ color: colors.text.primary }}>Extended Warranty</h3>
                                    <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>Protect your purchases for longer</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: colors.background.card }}>
                            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text.primary }}>Account Overview</h2>
                            <div className="space-y-3">
                                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.background.muted }}>
                                    <p className="text-sm" style={{ color: colors.text.secondary }}>Total Orders</p>
                                    <p className="text-2xl font-bold" style={{ color: colors.stone[600] }}>{orders.length}</p>
                                </div>
                                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.amber[50] }}>
                                    <p className="text-sm" style={{ color: colors.text.secondary }}>Rewards Points</p>
                                    <p className="text-2xl font-bold" style={{ color: colors.amber[600] }}>1,250</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: colors.background.card }}>
                            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text.primary }}>Recent Orders</h2>
                            <p className="text-sm mb-4" style={{ color: colors.text.secondary }}>Your latest purchases</p>

                            {ordersLoading ? (
                                <p className="italic text-sm" style={{ color: colors.text.muted }}>Loading orders...</p>
                            ) : ordersError ? (
                                <p className="italic text-sm" style={{ color: colors.text.muted }}>{ordersError}</p>
                            ) : orders.length === 0 ? (
                                <p className="italic text-sm" style={{ color: colors.text.muted }}>No orders found.</p>
                            ) : (
                                <div className="space-y-3">
                                    {orders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="rounded-lg p-3 transition-colors"
                                            style={{ border: `1px solid ${colors.border.light}` }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.background.muted}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-semibold text-sm" style={{ color: colors.text.primary }}>{order.itemName}</h3>
                                            </div>
                                            <p className="text-xs" style={{ color: colors.text.muted }}>
                                                {new Date(order.orderDate).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button className="w-full mt-4 py-2 text-sm font-medium rounded-lg transition-colors" 
                              style={{ 
                                color: colors.amber[600], 
                                border: `1px solid ${colors.amber[600]}` 
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.amber[50]}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                              onClick={() => router.push("/orders/history")}
                            >
                                View All Orders
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerPage;
