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

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", link: "/admin/dashboard" },
        { icon: Users, label: "Orders", link: "/admin/orders" },
        { icon: Users, label: "Warehouse", link: "/admin/warehouse" },
        { icon: Settings, label: "Analytics", link: "/admin/analytics" },
        { icon: FileText, label: "Activity", link: "/admin/activity" },
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

    return (
        <aside
            className={`transition-all duration-300 p-4 flex flex-col relative
            bg-gray-50 dark:bg-gray-900
            ${isOpen ? "w-48" : "w-16"}`}
        >
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="mb-4 p-2 rounded-lg
                hover:bg-gray-200 dark:hover:bg-gray-800
                dark:text-blue-200"
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
                                    hover:bg-gray-200 dark:hover:bg-gray-800
                                    dark:text-blue-200
                                    ${
                                        activeTab === item.label
                                            ? "bg-gray-200 dark:bg-gray-800"
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
                    hover:bg-gray-200 dark:hover:bg-gray-800
                    dark:text-blue-200"
                >
                    <UserCircle size={20} />
                </button>

                {showUserMenu && (
                    <div
                        className="
                            absolute bottom-0 left-full ml-3
                            bg-white dark:bg-gray-900
                            border border-gray-200 dark:border-gray-700
                            rounded-lg shadow-lg p-2
                            w-48 z-50
                        "
                    >
                        <div className="space-y-1">
                            <button
                                className="
                                w-full flex items-center gap-3 p-2 rounded-lg text-left
                                hover:bg-gray-100 dark:hover:bg-gray-800
                                dark:text-blue-200
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
                                hover:bg-gray-100 dark:hover:bg-gray-800
                                dark:text-blue-200
                                "
                            >
                                {mode === "light" ? <Sun size={18} /> : <Moon size={18} />}
                                <span className="text-sm font-medium">
                                    {mode === "light" ? "Light Mode" : "Dark Mode"}
                                </span>
                            </button>

                            <div className="border-t dark:border-gray-700 my-1" />

                            <button
                                className="
                                w-full flex items-center gap-3 p-2 rounded-lg text-left
                                hover:bg-red-50 dark:hover:bg-red-900/20
                                text-red-600 dark:text-red-400
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
