"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const { logout } = useAuth();

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
    <div
      className="relative w-full shadow-md"
      style={{
        background: `linear-gradient(135deg, ${colors.background.card} 0%, ${colors.background.accent} 45%, ${colors.background.muted} 100%)`,
        borderBottom: `1px solid ${colors.border.light}`,
      }}
    >
      <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${colors.border.accent}33, transparent, ${colors.border.accent}33)` }} />
      <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full blur-3xl" style={{ backgroundColor: `${colors.border.accent}55` }} />
      <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full blur-3xl" style={{ backgroundColor: `${colors.border.soft}55` }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <nav className="flex items-center gap-4 py-3.5">
          <div className="flex items-center gap-2 flex-1">
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
                        "px-4 py-2 text-sm font-semibold rounded-xl border transition-all duration-300 ease-out backdrop-blur-sm",
                        "hover:shadow-lg hover:-translate-y-px",
                        openMenu === id &&
                          "shadow-md"
                      )}
                      style={{
                        color: colors.text.primary,
                        borderColor: openMenu === id ? colors.border.accent : colors.border.soft,
                        backgroundColor: openMenu === id ? colors.background.muted : colors.background.card,
                      }}
                    >
                      {item.label}
                    </button>

                    {openMenu === id && (
                      <div className="absolute top-full left-0 mt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        <ul className="w-[220px] rounded-xl p-2 shadow-xl backdrop-blur-md" style={{ backgroundColor: colors.background.card, borderColor: colors.border.soft, borderWidth: '1px' }}>
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
                                  background: `linear-gradient(to right, ${colors.background.muted}, ${colors.background.accent})`,
                                  color: colors.text.accent
                                } : {}}
                                onMouseEnter={(e) => {
                                  if (!isActive(subItem.link)) {
                                    e.currentTarget.style.background = `linear-gradient(to right, ${colors.background.muted}, ${colors.background.accent})`;
                                    e.currentTarget.style.color = colors.text.secondary;
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
                                  style={{ backgroundColor: colors.text.accent }}
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
                      "px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ease-out backdrop-blur-sm border hover:-translate-y-px hover:shadow-md",
                      isActive(item.link)
                        ? "shadow-md"
                        : ""
                    )}
                    style={{
                      color: colors.text.primary,
                      borderColor: isActive(item.link) ? colors.border.accent : colors.border.soft,
                      backgroundColor: isActive(item.link) ? colors.background.muted : colors.background.card,
                    }}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
          </div>
          
          <div className="flex items-center justify-center flex-1">
            <div className="relative flex items-center group">
              <Search className="absolute left-3 w-4 h-4 pointer-events-none transition-colors duration-200 z-10" style={{ color: colors.neutral[600] }} />
              <Input 
                placeholder="Search..."
                className={clsx(
                  "pl-10 pr-4 py-2 h-10 rounded-full transition-all duration-300 shadow-sm hover:shadow-md font-medium",
                  searchExpanded ? "w-80" : "w-64"
                )}
                style={{
                  borderWidth: '2px',
                  borderColor: colors.border.soft,
                  color: colors.text.primary,
                  backgroundColor: colors.background.card,
                }}
                onFocus={(e) => {
                  setSearchExpanded(true);
                  e.currentTarget.style.borderColor = colors.border.focus;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.border.accent}66`;
                  const icon = e.currentTarget.previousElementSibling as HTMLElement;
                  if (icon) icon.style.color = colors.text.accent;
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
          
          <div className="flex items-center justify-end flex-1">
          <div className="relative">
            <UserRound
              className="w-7 h-7 cursor-pointer hover:scale-105 transition-transform"
              style={{ color: colors.text.primary }}
              onClick={() => setUserMenuOpen((prev) => !prev)}
            />

            {userMenuOpen && (
              <div className="absolute right-0 mt-3 w-40 rounded-xl shadow-xl overflow-hidden z-50" style={{ backgroundColor: colors.background.card, borderColor: colors.border.soft, borderWidth: '1px' }}>
                <Link
                  href="/customer/profile"
                  className="block px-4 py-2 text-sm transition-colors"
                  style={{ color: colors.text.secondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.background.muted;
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

                <button
                  type="button"
                  className="block w-full text-left px-4 py-2 text-sm transition-colors"
                  style={{ color: colors.text.secondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.background.muted;
                    e.currentTarget.style.color = colors.text.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = colors.text.secondary;
                  }}
                  onClick={() => {
                    logout();
                    setUserMenuOpen(false);
                    router.push("/login");
                  }}
                >
                  Logout
                </button>
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
