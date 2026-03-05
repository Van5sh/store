"use client";
import Sidebar from "@/components/admin-ui/Sidebar";
import React, { useState } from "react";
import Dashboard from "./dashboard/page";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  return (
    <div className={mode === "dark" ? "dark" : ""}>
      <div
        className="
                h-screen flex flex-col overflow-hidden justify-center
                bg-linear-to-br from-blue-50 via-[#F2F4F7] to-blue-100
                dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
            "
      >
        <h1 className="text-3xl p-4 bg-gray-50 font-bold text-blue-900 dark:bg-gray-900 dark:text-blue-300">
          Admin Panel
        </h1>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            mode={mode}
            setMode={setMode}
          />
          <main
            className="
                        flex-1 overflow-y-auto p-6
                        border border-blue-200
                        bg-[#F2F4F7]/60 backdrop-blur-md
                        shadow-lg rounded-lg dark:border-blue-900/40
                        dark:bg-[#F2F4F7bf] backdrop-filter
                        text-blue-900
                        dark:text-blue-400
                        dark:shadow-[0_0_25px_rgba(59,130,246,0.06)]
                    "
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
