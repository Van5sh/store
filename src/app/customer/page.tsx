"use client";

import React from "react";
import CarouselSize from "@/components/customer-ui/itemtype-carousel";

const greeting = [
    "Hello, valued customer!",
    "Welcome! How can we help you today?",
    "We're here to assist you with anything you need."
];

interface Order {
    id: number;
    item: string;
    date: string;
    status: string;
}

const CustomerPage = () => {
    const [randomGreeting, setRandomGreeting] = React.useState(greeting[0]);
    const [orders, setOrders] = React.useState<Order[]>([]);

    const productItems = [
        { label: "Electronics", img: "💻" },
        { label: "Clothing", img: "👕" },
        { label: "Home & Garden", img: "🏡" },
        { label: "Sports", img: "⚽" },
        { label: "Books", img: "📚" },
        { label: "Toys", img: "🎮" },
        { label: "Beauty", img: "💄" },
        { label: "Food", img: "🍔" }
    ];

    React.useEffect(() => {
        const randomIndex = Math.floor(Math.random() * greeting.length);
        setRandomGreeting(greeting[randomIndex]);
        const mockOrders = [
            { id: 1, item: "Product A", date: "2024-12-20", status: "Delivered" },
            { id: 2, item: "Product B", date: "2024-12-22", status: "Shipped" },
            { id: 3, item: "Product C", date: "2024-12-24", status: "Processing" }
        ];
        setOrders(mockOrders);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">{randomGreeting}</h1>
                    <p className="text-gray-600 text-base sm:text-lg">
                        This is the customer page where you can find various services tailored for you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Shop Here</h2>
                            <p className="text-gray-700 mb-6">
                                Find products and services that suit your needs. Browse through our extensive catalog and enjoy exclusive offers just for you.
                            </p>
                            <div className="relative px-12">
                                <CarouselSize Items={productItems} />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Quick Actions</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors">
                                    <div className="text-3xl mb-2">📦</div>
                                    <p className="text-sm font-medium text-gray-900">Track Order</p>
                                </button>
                                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors">
                                    <div className="text-3xl mb-2">🔄</div>
                                    <p className="text-sm font-medium text-gray-900">Returns</p>
                                </button>
                                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors">
                                    <div className="text-3xl mb-2">💳</div>
                                    <p className="text-sm font-medium text-gray-900">Payment</p>
                                </button>
                                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors">
                                    <div className="text-3xl mb-2">💬</div>
                                    <p className="text-sm font-medium text-gray-900">Support</p>
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Available Services</h2>
                            <div className="space-y-3">
                                <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                                    <h3 className="font-semibold text-gray-900">Premium Support</h3>
                                    <p className="text-sm text-gray-600 mt-1">Get 24/7 priority customer service</p>
                                </div>
                                <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                                    <h3 className="font-semibold text-gray-900">Express Shipping</h3>
                                    <p className="text-sm text-gray-600 mt-1">Upgrade to next-day delivery</p>
                                </div>
                                <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                                    <h3 className="font-semibold text-gray-900">Extended Warranty</h3>
                                    <p className="text-sm text-gray-600 mt-1">Protect your purchases for longer</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-900">Account Overview</h2>
                            <div className="space-y-3">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Total Orders</p>
                                    <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Rewards Points</p>
                                    <p className="text-2xl font-bold text-green-600">1,250</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Orders</h2>
                            <p className="text-sm text-gray-600 mb-4">Your latest purchases</p>

                            {orders.length === 0 ? (
                                <p className="text-gray-500 italic text-sm">No orders found.</p>
                            ) : (
                                <div className="space-y-3">
                                    {orders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-sm text-gray-900">{order.item}</h3>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-2">{order.date}</p>
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                                order.status === "Delivered"
                                                    ? "bg-green-100 text-green-800"
                                                    : order.status === "Shipped"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
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