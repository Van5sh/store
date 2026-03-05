"use client"; 
import React, { useState } from "react"; 
import { colors } from "@/lib/colors";
 
type Props = { 
  children: React.ReactNode; 
  editUser: React.ReactNode; 
  orderdetails: React.ReactNode; 
};
 
export default function UserLayout({  
  children,
  editUser,
  orderdetails 
}: Props) { 
  const [active, setActive] = useState<"profile" | "edit" | "orders">("profile"); 
  
  return ( 
    <div className="p-6 max-w-7xl mx-auto"> 
      <h1 className="text-3xl font-bold mb-6" style={{ color: colors.text.primary }}>User Account</h1>
      
      <nav className="flex flex-row gap-2 mb-6 border-b" style={{ borderColor: colors.border.soft }}> 
        <button 
          onClick={() => setActive("profile")}
          className={`px-6 py-3 font-medium transition-all border-b-2 ${
            active === "profile" 
              ? "border-transparent" 
              : "border-transparent"
          }`}
          style={active === "profile"
            ? { borderColor: colors.text.accent, color: colors.text.accent }
            : { color: colors.text.secondary }}
        >
          Profile
        </button> 
        <button 
          onClick={() => setActive("edit")}
          className={`px-6 py-3 font-medium transition-all border-b-2 ${
            active === "edit" 
              ? "border-transparent" 
              : "border-transparent"
          }`}
          style={active === "edit"
            ? { borderColor: colors.text.accent, color: colors.text.accent }
            : { color: colors.text.secondary }}
        >
          Edit User
        </button> 
        <button 
          onClick={() => setActive("orders")}
          className={`px-6 py-3 font-medium transition-all border-b-2 ${
            active === "orders" 
              ? "border-transparent" 
              : "border-transparent"
          }`}
          style={active === "orders"
            ? { borderColor: colors.text.accent, color: colors.text.accent }
            : { color: colors.text.secondary }}
        >
          Order Details
        </button> 
      </nav> 
      
      <main
        className="rounded-lg shadow-sm p-6 border"
        style={{ backgroundColor: colors.background.card, borderColor: colors.border.light, color: colors.text.primary }}
      > 
        {active === "profile" && children}
        {active === "edit" && editUser}
        {active === "orders" && orderdetails}
      </main> 
    </div> 
  ); 
}
