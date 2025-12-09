"use client"; 
import React, { useState } from "react"; 
 
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
      <h1 className="text-3xl font-bold mb-6">User Account</h1>
      
      <nav className="flex flex-row gap-2 mb-6 border-b border-gray-200"> 
        <button 
          onClick={() => setActive("profile")}
          className={`px-6 py-3 font-medium transition-all border-b-2 ${
            active === "profile" 
              ? "border-blue-600 text-blue-600" 
              : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
          }`}
        >
          Profile
        </button> 
        <button 
          onClick={() => setActive("edit")}
          className={`px-6 py-3 font-medium transition-all border-b-2 ${
            active === "edit" 
              ? "border-blue-600 text-blue-600" 
              : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
          }`}
        >
          Edit User
        </button> 
        <button 
          onClick={() => setActive("orders")}
          className={`px-6 py-3 font-medium transition-all border-b-2 ${
            active === "orders" 
              ? "border-blue-600 text-blue-600" 
              : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
          }`}
        >
          Order Details
        </button> 
      </nav> 
      
      <main className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"> 
        {active === "profile" && children} 
        {active === "edit" && editUser} 
        {active === "orders" && orderdetails} 
      </main> 
    </div> 
  ); 
}