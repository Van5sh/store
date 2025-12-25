"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import clsx from "clsx";

interface NavigationMenuProps {
    items: Array<{
        label: string;
        link: string;
        subItems?: Array<{ label: string; link: string }>;
    }>;
}

const TopNavigation: React.FC<NavigationMenuProps> = ({ items }) => {
    const pathname = usePathname();

    const isActive = (link: string) =>
        pathname === link || pathname.startsWith(link + "/");

    return (
        <div className="w-full bg-linear-to-br from-green-500 via-green-600 to-green-700 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-white/5 via-transparent to-white/5"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-800/10 rounded-full blur-3xl"></div>
            
            <div className="mx-auto max-w-7xl px-6 relative z-10">
                <NavigationMenu>
                    <NavigationMenuList className="flex gap-3 py-4">
                        {items.map((item, id) => (
                            <NavigationMenuItem key={id}>
                                {item.subItems && item.subItems.length > 0 ? (
                                    <>
                                        <NavigationMenuTrigger
                                            className={clsx(
                                                "px-6 py-3 font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm border-2",
                                                isActive(item.link)
                                                    ? "bg-white text-green-700 shadow-lg border-white scale-105"
                                                    : "text-white border-white/20 hover:bg-white hover:text-green-700 hover:shadow-xl hover:scale-105 hover:border-white"
                                            )}
                                        >
                                            {item.label}
                                        </NavigationMenuTrigger>

                                        <NavigationMenuContent>
                                            <ul className="min-w-[260px] bg-white rounded-2xl shadow-2xl p-4 border-2 border-green-100 backdrop-blur-sm">
                                                {item.subItems.map((subItem, subId) => (
                                                    <li key={subId} className="mb-1 last:mb-0">
                                                        <NavigationMenuLink asChild>
                                                            <Link
                                                                href={subItem.link}
                                                                className={clsx(
                                                                    "group flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden",
                                                                    isActive(subItem.link)
                                                                        ? "bg-linear-to-r from-green-100 to-green-50 text-green-800 font-bold shadow-md"
                                                                        : "text-slate-700 hover:bg-linear-to-r hover:from-green-50 hover:to-green-100/50 hover:text-green-700 hover:shadow-sm"
                                                                )}
                                                            >
                                                                <span className={clsx(
                                                                    "absolute left-0 w-1 h-full bg-green-600 transition-all duration-300 rounded-r-full",
                                                                    isActive(subItem.link) 
                                                                        ? "opacity-100" 
                                                                        : "opacity-0 group-hover:opacity-100"
                                                                )}></span>
                                                                <span className={clsx(
                                                                    "transition-all duration-300",
                                                                    isActive(subItem.link) 
                                                                        ? "ml-3" 
                                                                        : "ml-0 group-hover:ml-3"
                                                                )}>
                                                                    {subItem.label}
                                                                </span>
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    </li>
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </>
                                ) : (
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href={item.link}
                                            className={clsx(
                                                "block px-6 py-3 font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm border-2",
                                                isActive(item.link)
                                                    ? "bg-white text-green-700 shadow-lg border-white scale-105"
                                                    : "text-white border-white/20 hover:bg-white hover:text-green-700 hover:shadow-xl hover:scale-105 hover:border-white"
                                            )}
                                        >
                                            {item.label}
                                        </Link>
                                    </NavigationMenuLink>
                                )}
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
            
            {/* Bottom border accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-white/30 to-transparent"></div>
        </div>
    );
};

export default TopNavigation;