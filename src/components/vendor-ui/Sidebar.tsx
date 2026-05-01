"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    PanelLeftOpen,
    PanelLeftClose,
    LayoutDashboard,
    Users,
    Settings,
    FileText,
    UserCircle,
    LogOut,
    Sun,
    Moon,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
    activeTab?: string;
    setActiveTab?: (tab: string) => void;
    mode?: "light" | "dark";
    setMode?: (mode: "light" | "dark") => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    activeTab,
    setActiveTab,
    mode,
    setMode,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const userMenuRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const { logout } = useAuth();

    const menuItems = [
        { icon: LayoutDashboard, label: "Home", link: "/vendor" },
        { icon: Users, label: "Products", link: "/vendor/products" },
        { icon: Users, label: "Warehouse", link: "/vendor/warehouse" },
        { icon: Settings, label: "Analytics", link: "/vendor/analytics" },
        { icon: FileText, label: "Orders", link: "/vendor/orders" },
        { icon: FileText, label: "Activity", link: "/vendor/activity" }
    ];

    const handleThemeToggle = () => {
        if (setMode) {
            setMode(mode === "light" ? "dark" : "light");
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target as Node)
            ) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        localStorage.removeItem("vendor_stores");
        localStorage.removeItem("active_store_id");
        setShowUserMenu(false);
        router.replace("/");
    };

    return (
        <aside
            className={`transition-all duration-300 p-4 flex flex-col relative
            bg-[#F5F7FA] text-[#0B1215]
            dark:bg-[#16272D] dark:text-[#F5F7FA]
            ${isOpen ? "w-48" : "w-16"}`}
        >
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="mb-4 p-2 rounded-lg
                hover:bg-[#E9EEF2] dark:hover:bg-[#1B3138]
                text-[#203A43] dark:text-[#F5F7FA]"
            >
                {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>

            <nav className="space-y-2 flex-1">
                {menuItems.map((item) => (
                    <Tooltip key={item.label}>
                        <TooltipTrigger asChild>
                            <Link href={item.link}>
                                <button
                                    onClick={() =>
                                        setActiveTab && setActiveTab(item.label)
                                    }
                                    className={`w-full flex items-center gap-3 p-2 rounded-lg
                                    hover:bg-[#E9EEF2] dark:hover:bg-[#1B3138]
                                    text-[#203A43] dark:text-[#F5F7FA]
                                    ${
                                        activeTab === item.label
                                            ? "bg-[#E9EEF2] dark:bg-[#1B3138]"
                                            : ""
                                    }`}
                                >
                                    <item.icon size={20} />
                                    {isOpen && (
                                        <span className="font-semibold text-sm">
                                            {item.label}
                                        </span>
                                    )}
                                </button>
                            </Link>
                        </TooltipTrigger>

                        {!isOpen && (
                            <TooltipContent side="right">
                                <span className="text-sm">{item.label}</span>
                            </TooltipContent>
                        )}
                    </Tooltip>
                ))}
            </nav>

            <div className="relative" ref={userMenuRef}>
                <button
                    onClick={() => setShowUserMenu((prev) => !prev)}
                    className="mt-4 p-2 rounded-lg w-full flex justify-center
                    hover:bg-[#E9EEF2] dark:hover:bg-[#1B3138]
                    text-[#203A43] dark:text-[#F5F7FA]"
                >
                    <UserCircle size={20} />
                </button>

                {showUserMenu && (
                    <div
                        className="
                            absolute bottom-0 left-full ml-3
                            bg-[#FFFFFF] dark:bg-[#1B3138]
                            border border-[#D8DEE5] dark:border-[#254757]
                            rounded-lg shadow-lg p-2
                            w-48 z-50
                        "
                    >
                        <div className="space-y-1">
                            <button
                                className="
                                w-full flex items-center gap-3 p-2 rounded-lg text-left
                                hover:bg-[#F0F3F6] dark:hover:bg-[#203A43]
                                text-[#203A43] dark:text-[#F5F7FA]
                                "
                            >
                                <Settings size={18} />
                                <span className="text-sm font-medium">
                                    Settings
                                </span>
                            </button>

                            <button
                                onClick={handleThemeToggle}
                                className="
                                w-full flex items-center gap-3 p-2 rounded-lg text-left
                                hover:bg-[#F0F3F6] dark:hover:bg-[#203A43]
                                text-[#203A43] dark:text-[#F5F7FA]
                                "
                            >
                                {mode === "light" ? <Sun size={18} /> : <Moon size={18} />}
                                <span className="text-sm font-medium">
                                    {mode === "light" ? "Light Mode" : "Dark Mode"}
                                </span>
                            </button>

                            <div className="border-t border-[#D8DEE5] dark:border-[#254757] my-1" />

                            <button
                                onClick={handleLogout}
                                className="
                                w-full flex items-center gap-3 p-2 rounded-lg text-left
                                hover:bg-[#FCEEEE] dark:hover:bg-[#3A1B1B]
                                text-[#B3261E] dark:text-[#F0B4AE]
                                "
                            >
                                <LogOut size={18} />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
