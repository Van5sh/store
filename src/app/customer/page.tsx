"use client";

import React from "react";
import CarouselSize from "@/components/customer-ui/itemtype-carousel";

const greeting = [
    "Hello, valued customer!",
    "Welcome! How can we help you today?",
    "We're here to assist you with anything you need."
];

const CustomerPage = () => {
    const [randomGreeting, setRandomGreeting] = React.useState(greeting[0]);
    const [orders, setOrders] = React.useState([]);

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
        <div className="p-8 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">{randomGreeting}</h1>
                <p className="text-gray-600 mb-8">
                    This is the customer page where you can find various services tailored for you.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <div className="bg-white justify-center rounded-lg  shadow-md p-6 mb-6">
                                <h2 className="text-2xl font-semibold mb-4">Shop Here</h2>
                                <p className="text-gray-700">
                                    Find products and services that suit your needs. Browse through our extensive catalog and enjoy exclusive offers just for you.
                                </p>
                                <div className="m-2">
                                    <CarouselSize/>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="text-2xl mb-2">📦</div>
                                    <p className="text-sm font-medium">Track Order</p>
                                </button>
                                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="text-2xl mb-2">🔄</div>
                                    <p className="text-sm font-medium">Returns</p>
                                </button>
                                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="text-2xl mb-2">💳</div>
                                    <p className="text-sm font-medium">Payment</p>
                                </button>
                                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="text-2xl mb-2">💬</div>
                                    <p className="text-sm font-medium">Support</p>
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-semibold mb-4">Available Services</h2>
                            <div className="space-y-3">
                                <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
                                    <h3 className="font-semibold">Premium Support</h3>
                                    <p className="text-sm text-gray-600">Get 24/7 priority customer service</p>
                                </div>
                                <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
                                    <h3 className="font-semibold">Express Shipping</h3>
                                    <p className="text-sm text-gray-600">Upgrade to next-day delivery</p>
                                </div>
                                <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
                                    <h3 className="font-semibold">Extended Warranty</h3>
                                    <p className="text-sm text-gray-600">Protect your purchases for longer</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Account Overview & Orders */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Account Overview</h2>
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

                        <div className="bg-white rounded-lg shadow-md p-4">
                            <h2 className="text-xl font-semibold mb-3">Recent Orders</h2>
                            <p className="text-sm text-gray-600 mb-3">Your latest purchases</p>

                            {orders.length === 0 ? (
                                <p className="text-gray-500 italic text-sm">No orders found.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {orders.map((order) => (
                                        <li
                                            key={order.id}
                                            className="border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-semibold text-sm">{order.item}</h3>
                                                </div>
                                                <p className="text-xs text-gray-500">{order.date}</p>
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
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
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