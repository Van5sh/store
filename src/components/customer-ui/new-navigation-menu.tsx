"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Search, UserRound } from "lucide-react";
import clsx from "clsx";
import { Input } from "../ui/input";
import { colors } from "@/lib/colors";

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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);

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
    <div className="relative w-full shadow-xl" style={{ background: `linear-gradient(135deg, ${colors.stone[600]} 0%, ${colors.stone[700]} 50%, ${colors.stone[800]} 100%)` }}>
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5" />
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full blur-3xl" style={{ backgroundColor: `${colors.amber[400]}1A` }} />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full blur-3xl" style={{ backgroundColor: `${colors.stone[900]}1A` }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <nav className="flex items-center justify-center gap-2 py-4">
          <div className="flex items-center gap-2">
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
                        "border-white/30 hover:bg-white/10 hover:shadow-xl hover:-translate-y-px hover:scale-[1.02]",
                        openMenu === id &&
                          "bg-white/15 ring-1 ring-white/40"
                      )}
                    >
                      {item.label}
                    </button>

                    {openMenu === id && (
                      <div className="absolute top-full left-0 mt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        <ul className="w-[220px] rounded-xl bg-white/95 p-2 shadow-xl backdrop-blur-md" style={{ borderColor: colors.border.soft, borderWidth: '1px' }}>
                          {item.subItems!.map((subItem, subId) => (
                            <li key={subId} className="mb-1 last:mb-0">
                              <Link
                                href={subItem.link}
                                className={clsx(
                                  "group relative flex items-center rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200 ease-out overflow-hidden hover:translate-x-0.5",
                                  isActive(subItem.link)
                                    ? "font-semibold shadow-sm"
                                    : ""
                                )}
                                style={isActive(subItem.link) ? {
                                  background: `linear-gradient(to right, ${colors.amber[100]}, ${colors.amber[50]})`,
                                  color: colors.text.accent
                                } : {}}
                                onMouseEnter={(e) => {
                                  if (!isActive(subItem.link)) {
                                    e.currentTarget.style.background = `linear-gradient(to right, ${colors.background.muted}, ${colors.amber[50]})`;
                                    e.currentTarget.style.color = colors.stone[700];
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isActive(subItem.link)) {
                                    e.currentTarget.style.background = '';
                                    e.currentTarget.style.color = colors.text.secondary;
                                  }
                                }}
                              >
                                <span
                                  className={clsx(
                                    "absolute left-0 h-full w-[3px] transition-opacity duration-200 rounded-r-full",
                                    isActive(subItem.link)
                                      ? "opacity-100"
                                      : "opacity-0 group-hover:opacity-100"
                                  )}
                                  style={{ backgroundColor: colors.amber[600] }}
                                />
                                <span className="ml-2 transition-transform duration-200 group-hover:translate-x-px" style={{ color: isActive(subItem.link) ? colors.text.accent : colors.text.secondary }}>
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
                      "px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ease-out backdrop-blur-sm text-white border-2 hover:-translate-y-px hover:scale-[1.02]",
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
          </div>
          
          <div className="flex items-center gap-2 mx-auto">
            <div className="relative flex items-center group">
              <Search className="absolute left-3 w-4 h-4 pointer-events-none transition-colors duration-200 z-10" style={{ color: colors.neutral[600] }} />
              <Input 
                placeholder="Search..."
                className={clsx(
                  "pl-10 pr-4 py-2 h-10 bg-white rounded-full transition-all duration-300 shadow-md hover:shadow-lg font-medium",
                  searchExpanded ? "w-80" : "w-64"
                )}
                style={{
                  borderWidth: '2px',
                  borderColor: colors.border.soft,
                  color: colors.text.primary
                }}
                onFocus={(e) => {
                  setSearchExpanded(true);
                  e.currentTarget.style.borderColor = colors.border.focus;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.amber[100]}`;
                  const icon = e.currentTarget.previousElementSibling as HTMLElement;
                  if (icon) icon.style.color = colors.amber[600];
                }}
                onBlur={(e) => {
                  setSearchExpanded(false);
                  e.currentTarget.style.borderColor = colors.border.soft;
                  e.currentTarget.style.boxShadow = '';
                  const icon = e.currentTarget.previousElementSibling as HTMLElement;
                  if (icon) icon.style.color = colors.neutral[600];
                }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
          <div className="relative">
            <UserRound
              className="text-white w-7 h-7 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setUserMenuOpen((prev) => !prev)}
            />

            {userMenuOpen && (
              <div className="absolute right-0 mt-3 w-40 rounded-xl bg-white shadow-xl overflow-hidden z-50" style={{ borderColor: colors.border.soft, borderWidth: '1px' }}>
                <Link
                  href="/customer/profile"
                  className="block px-4 py-2 text-sm transition-colors"
                  style={{ color: colors.text.secondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.amber[50];
                    e.currentTarget.style.color = colors.text.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = colors.text.secondary;
                  }}
                  onClick={() => setUserMenuOpen(false)}
                >
                  Profile
                </Link>

                <Link
                  href="/customer/logout"
                  className="block px-4 py-2 text-sm transition-colors"
                  style={{ color: colors.text.secondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.amber[50];
                    e.currentTarget.style.color = colors.text.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = colors.text.secondary;
                  }}
                  onClick={() => setUserMenuOpen(false)}
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default TopNavigation;