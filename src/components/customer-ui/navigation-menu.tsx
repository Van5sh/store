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
        /* FULL-WIDTH BACKGROUND */
        <div className="w-full bg-gradient-to-r from-amber-400 to-amber-500 border-b border-amber-600 shadow-md">
            <NavigationMenu className="mx-auto max-w-7xl px-6 py-3">
                <NavigationMenuList className="flex gap-1">
                    {items.map((item, id) => (
                        <NavigationMenuItem key={id}>
                            {item.subItems?.length ? (
                                <>
                                    <NavigationMenuTrigger
                                        className={clsx(
                                            "px-4 py-2 font-medium rounded-md transition",
                                            isActive(item.link)
                                                ? "bg-white text-amber-700"
                                                : "text-gray-800 hover:bg-amber-600 hover:text-white"
                                        )}
                                    >
                                        {item.label}
                                    </NavigationMenuTrigger>

                                    <NavigationMenuContent>
                                        <ul className="min-w-[220px] bg-white rounded-lg shadow-lg p-2 border">
                                            {item.subItems.map((subItem, subId) => (
                                                <li key={subId}>
                                                    <NavigationMenuLink asChild>
                                                        <Link
                                                            href={subItem.link}
                                                            className={clsx(
                                                                "block px-4 py-2 rounded-md transition",
                                                                isActive(subItem.link)
                                                                    ? "bg-amber-100 text-amber-700 font-medium"
                                                                    : "text-gray-700 hover:bg-amber-50 hover:text-amber-700"
                                                            )}
                                                        >
                                                            {subItem.label}
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
                                            "block px-4 py-2 font-medium rounded-md transition",
                                            isActive(item.link)
                                                ? "bg-white text-amber-700"
                                                : "text-gray-800 hover:bg-amber-600 hover:text-white"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                </NavigationMenuLink>
                            )}
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
                <div>

                </div>
            </NavigationMenu>
        </div>
    );
};

export default TopNavigation;
