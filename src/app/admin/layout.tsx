'use client';
import Sidebar from "@/components/admin-ui/Sidebar";
import React,{useState} from "react";
import Dashboard from "./dashboard/page";

type AdminLayoutProps = {
    children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [activeTab, setActiveTab] = useState("Dashboard");
    return (
        <div className="max-w-7xl h-screen flex flex-col overflow-hidden">
            <h1 className="text-3xl p-4 bg-gray-50 font-bold">Admin Panel</h1>

            <div className="flex gap-6 bg-white flex-1 overflow-hidden">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <main className="flex-1 overflow-y-auto p-6">
                    {activeTab==="Dashboard" && <Dashboard />}
                    {activeTab==="Orders" && <h2 className="text-2xl font-semibold mb-4">Orders Content</h2>}
                    {activeTab==="Analytics" && <h2 className="text-2xl font-semibold mb-4">Analytics Content</h2>}
                    {activeTab==="Activity" && <h2 className="text-2xl font-semibold mb-4">Activity Content</h2>}
                </main>
            </div>
        </div>
    );
}