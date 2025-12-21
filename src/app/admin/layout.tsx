import Sidebar from "@/components/admin-ui/Sidebar";
import React from "react";

type AdminLayoutProps = {
    children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="max-w-7xl h-screen flex flex-col overflow-hidden">
            <h1 className="text-3xl p-4 bg-gray-50 font-bold">Admin Panel</h1>

            <div className="flex gap-6 bg-white flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}