"use client";

import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

export default function DashboardLayout({
  orderDetails,
  warehouseDetails,
  children,
}: {
  orderDetails?: React.ReactNode;
  warehouseDetails?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col">
      {children}
    </div>
  );
}
