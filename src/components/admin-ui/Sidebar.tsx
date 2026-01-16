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

interface SidebarProps {
    activeTab?: string;
    setActiveTab?: (tab: string) => void;
    mode?: "light" | "dark";
    setMode?: (mode: "light" | "dark") => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, mode, setMode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const userMenuRef = useRef<HTMLDivElement | null>(null);

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard" },
        { icon: Users, label: "Orders" },
        { icon: Settings, label: "Analytics" },
        { icon: FileText, label: "Activity" },
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
            className={`transition-all duration-300 bg-gray-50 dark:bg-gray-900 p-4 flex flex-col relative
            ${isOpen ? "w-48" : "w-16"}`}
        >
            <button
                onClick={() => {
                    setIsOpen((prev) => !prev)
                }}
                className="mb-4 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-blue-200 rounded-lg"
            >
                {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
            <nav className="space-y-2 flex-1">
                {menuItems.map((item) => (
                    <div key={item.label} className="relative group">
                        <button
                            onClick={() => setActiveTab && setActiveTab(item.label)}
                            className={`w-full flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-blue-200 rounded-lg
                            ${activeTab === item.label ? "bg-gray-200 dark:bg-gray-800" : ""}`}
                        >
                            <item.icon size={20} />
                            {isOpen && (
                                <span className="font-semibold text-sm">{item.label}</span>
                            )}
                        </button>
                        {!isOpen && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                                {item.label}
                            </div>
                        )}
                    </div>
                ))}
            </nav>            

            <div className="relative" ref={userMenuRef}>
                <button
                    onClick={() => setShowUserMenu((prev) => !prev)}
                    className="mt-4 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-blue-200 rounded-lg w-full flex justify-center"
                    aria-label="User menu"
                >
                    <UserCircle size={20} />
                </button>

                {showUserMenu && (
                    <div
                        className="
                            absolute bottom-0 left-full ml-3
                            bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                            rounded-lg shadow-lg p-2
                            w-48 z-50
                        "
                    >
                        <div className="space-y-1">
                            <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-blue-200 rounded-lg text-left">
                                <Settings size={18} />
                                <span className="text-sm font-medium">
                                    Settings
                                </span>
                            </button>

                            <button
                                onClick={handleThemeToggle}
                                className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-blue-200 rounded-lg text-left"
                            >
                                {mode === "light" ? <Sun size={18} /> : <Moon size={18} />}
                                <span className="text-sm font-medium">
                                    {mode === "light" ? "Light Mode" : "Dark Mode"}
                                </span>
                            </button>
                            <div className="border-t dark:border-gray-700 my-1" />
                            <button className="w-full flex items-center gap-3 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-left">
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