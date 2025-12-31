"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
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
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  const isActive = (link: string) =>
    pathname === link || pathname.startsWith(link + "/");

  const handleMouseEnter = (id: number, hasSub: boolean) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    if (hasSub) setOpenMenu(id);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setOpenMenu(null);
    }, 120);
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-green-500 via-green-600 to-green-700 shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5" />
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-green-400/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-green-800/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <nav className="flex items-center gap-2 py-4">
          {items.map((item, id) => {
            const hasSub = Boolean(item.subItems?.length);

            return (
              <div
                key={id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(id, hasSub)}
                onMouseLeave={handleMouseLeave}
              >
                {hasSub ? (
                  <>
                    <button
                      type="button"
                      className={clsx(
                        "px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-all duration-300 ease-out backdrop-blur-sm text-white",
                        "border-white/30 hover:bg-white/10 hover:shadow-xl hover:-translate-y-[1px] hover:scale-[1.02]",
                        openMenu === id &&
                          "bg-white/15 ring-1 ring-white/40"
                      )}
                    >
                      {item.label}
                    </button>

                    {openMenu === id && (
                      <div className="absolute top-full left-0 mt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        <ul className="w-[220px] rounded-xl bg-white/95 p-2 border border-green-100 shadow-xl backdrop-blur-md">
                          {item.subItems!.map((subItem, subId) => (
                            <li key={subId} className="mb-1 last:mb-0">
                              <Link
                                href={subItem.link}
                                className={clsx(
                                  "group relative flex items-center rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200 ease-out overflow-hidden hover:translate-x-[2px]",
                                  isActive(subItem.link)
                                    ? "bg-gradient-to-r from-green-100/80 to-green-50 text-green-800 font-semibold shadow-sm"
                                    : "text-slate-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100/40 hover:text-green-700"
                                )}
                              >
                                <span
                                  className={clsx(
                                    "absolute left-0 h-full w-[3px] bg-green-600 transition-opacity duration-200",
                                    isActive(subItem.link)
                                      ? "opacity-100 rounded-r-full"
                                      : "opacity-0 group-hover:opacity-100"
                                  )}
                                />
                                <span className="ml-2 transition-transform duration-200 group-hover:translate-x-[1px]">
                                  {subItem.label}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.link}
                    className={clsx(
                      "px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ease-out backdrop-blur-sm text-white border-2 hover:-translate-y-[1px] hover:scale-[1.02]",
                      isActive(item.link)
                        ? "bg-white/15 ring-1 ring-white/40 shadow-lg border-white/40"
                        : "border-white/30 hover:bg-white/10 hover:shadow-xl"
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default TopNavigation;
