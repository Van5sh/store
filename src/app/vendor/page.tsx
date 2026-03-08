"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const VendorPage = () => {
    const { user } = useAuth();

    const displayName = user?.name ?? user?.userName ?? "Vendor";
    const displayUserName = user?.userName ?? user?.name ?? "N/A";
    const displayEmail = user?.email ?? "N/A";
    const displayRole = user?.role ?? "vendor";

    return (
        <>
            <div>
                <div className="text-lg font-semibold">Vendor Dashboard</div>
                <div className="text-sm text-[#5B6770] dark:text-[#D8DEE5] mt-2">
                    Overview of today’s performance and activity.
                </div>
            </div>

            <div className="mt-6 flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                <section className="min-h-0">
                    <Card className="border-[#D8DEE5] bg-[#F5F7FA] text-[#203A43] dark:border-[#254757] dark:bg-[#203A43] dark:text-[#F5F7FA]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                                {displayName}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-[#5B6770] dark:text-[#D8DEE5]">
                                    Username
                                </span>
                                <span className="font-medium">
                                    {displayUserName}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[#5B6770] dark:text-[#D8DEE5]">
                                    Email
                                </span>
                                <span className="font-medium">
                                    {displayEmail}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[#5B6770] dark:text-[#D8DEE5]">
                                    Role
                                </span>
                                <span className="font-medium">
                                    {displayRole}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <aside
                    className="
                        rounded-lg border border-[#D8DEE5]
                        bg-[#F5F7FA]
                        p-4 shadow-sm
                        h-full flex flex-col
                        dark:border-[#254757]
                        dark:bg-[#203A43]
                    "
                >
                    <h2 className="text-sm font-semibold text-[#203A43] dark:text-[#F5F7FA]">
                        Recent Activity
                    </h2>
                    <div className="mt-4 space-y-3 text-sm text-[#203A43] dark:text-[#F5F7FA] flex-1 overflow-y-auto">
                        {[
                            {
                                title: "Order #4021 shipped",
                                time: "2 hours ago",
                            },
                            {
                                title: "Inventory updated",
                                time: "Today, 9:12 AM",
                            },
                            {
                                title: "New return request",
                                time: "Yesterday, 6:40 PM",
                            },
                            {
                                title: "Payout processed",
                                time: "Yesterday, 11:05 AM",
                            },
                            {
                                title: "New vendor message",
                                time: "Mar 3, 2026",
                            },
                            {
                                title: "Weekly summary ready",
                                time: "Mar 2, 2026",
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="
                                    flex items-center justify-between
                                    border-b border-[#D8DEE5]
                                    pb-2 last:border-b-0 last:pb-0
                                    dark:border-[#254757]
                                "
                            >
                                <div>
                                    <p className="font-medium">
                                        {item.title}
                                    </p>
                                    <p className="text-xs text-[#5B6770] dark:text-[#D8DEE5]">
                                        {item.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </>
    );
};

export default VendorPage;
