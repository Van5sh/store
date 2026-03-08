"use client";

import React, { useState } from "react";
import Sidebar from "@/components/vendor-ui/Sidebar";

type VendorLayoutProps = {
    children: React.ReactNode;
};

export default function VendorLayout({ children }: VendorLayoutProps) {
    const [mode, setMode] = useState<"light" | "dark">("light");

    return (
        <div className={mode === "dark" ? "dark" : ""}>
            <div
                className="
                    h-screen flex flex-col overflow-hidden justify-center
                    bg-linear-to-br from-[#F5F7FA] via-[#EEF2F6] to-[#E6EDF2]
                    dark:from-[#16272D] dark:via-[#1B3138] dark:to-[#203A43]
                "
            >
                <h1 className="text-3xl p-4 bg-[#F5F7FA] font-bold text-[#203A43] dark:bg-[#16272D] dark:text-[#F5F7FA]">
                    Vendor Panel
                </h1>
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar mode={mode} setMode={setMode} />
                    <main
                        className="
                            flex-1 overflow-y-auto p-6 flex flex-col
                            border border-[#D8DEE5]
                            bg-[#FFFFFF]/70 backdrop-blur-md
                            shadow-lg rounded-lg
                            text-[#0B1215]
                            dark:border-[#254757]
                            dark:bg-[#1B3138]/70
                            dark:text-[#F5F7FA]
                        "
                    >
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
