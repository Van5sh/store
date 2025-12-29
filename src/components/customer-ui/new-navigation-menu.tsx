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
    <div className="w-full bg-linear-to-br from-green-500 via-green-600 to-green-700 shadow-xl relative overflow-visible">
      <div className="absolute inset-0 bg-linear-to-r from-white/5 via-transparent to-white/5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-800/10 rounded-full blur-3xl"></div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <NavigationMenu className="max-w-full">
          <NavigationMenuList className="flex flex-wrap items-center gap-2 py-2">
            {items.map((item, id) => (
              <NavigationMenuItem key={id} className="list-none relative ">
                {item.subItems && item.subItems.length > 0 ? (
                  <>
                    <NavigationMenuTrigger
                      className={clsx(
                        "px-4 py-2 font-semibold rounded-lg transition-all  duration-300 backdrop-blur-sm border-2 bg-transparent h-auto",
                        isActive(item.link)
                          ? "bg-white! text-green-700! shadow-lg border-white!"
                          : "text-white border-white/20 hover:bg-white! hover:text-green-700! hover:shadow-xl hover:border-white! data-[state=open]:bg-white! data-[state=open]:text-green-700!"
                      )}
                    >
                      {item.label}
                    </NavigationMenuTrigger>

                    <NavigationMenuContent className="left-0! right-auto! w-auto! min-w-[260px] data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52">
                      <ul className="bg-white rounded-2xl shadow-2xl p-4 border-2 border-green-100 m-0">
                        {item.subItems.map((subItem, subId) => (
                          <li key={subId} className="mb-1 last:mb-0 list-none">
                            <NavigationMenuLink asChild>
                              <Link
                                href={subItem.link}
                                className={clsx(
                                  "group flex items-center  px-4 py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden",
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
                        "block px-4 py-2 font-semibold rounded-lg transition-all duration-300 backdrop-blur-sm border-2",
                        isActive(item.link)
                          ? "bg-white text-green-700 shadow-lg border-white"
                          : "text-white border-white/20 hover:bg-white hover:text-green-700 hover:shadow-xl hover:border-white"
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
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-white/30 to-transparent"/>
    </div>
  );
};

export default TopNavigation;